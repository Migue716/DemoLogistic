using System.Text;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ShipTrack.Functions.Models;

namespace ShipTrack.Functions.Services;

/// <summary>
/// Procesa la cola de envíos insertados y envía el correo (mismo flujo que antes, desacoplado por Service Bus).
/// Solo se registra en <see cref="Program"/> si existe <c>ShipmentServiceBus</c>.
/// </summary>
public sealed class ShipmentInsertedQueueWorker : BackgroundService
{
    private readonly ILogger<ShipmentInsertedQueueWorker> _logger;
    private readonly string _connectionString;
    private readonly string _queueName;

    private static readonly JsonSerializerOptions JsonReadOpts = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public ShipmentInsertedQueueWorker(ILogger<ShipmentInsertedQueueWorker> logger)
    {
        _logger = logger;
        _connectionString = Environment.GetEnvironmentVariable("ShipmentServiceBus") ?? "";
        var q = Environment.GetEnvironmentVariable("ShipmentInsertedQueueName");
        _queueName = string.IsNullOrWhiteSpace(q) ? "shipment-inserted" : q;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (string.IsNullOrWhiteSpace(_connectionString))
            return;

        await using var client = new ServiceBusClient(_connectionString);
        var options = new ServiceBusProcessorOptions
        {
            AutoCompleteMessages = false,
            MaxConcurrentCalls = 4,
        };
        await using var processor = client.CreateProcessor(_queueName, options);

        processor.ProcessMessageAsync += OnMessageAsync;
        processor.ProcessErrorAsync += OnErrorAsync;

        await processor.StartProcessingAsync(stoppingToken).ConfigureAwait(false);
        _logger.LogInformation("Escuchando cola Service Bus {Queue} para nuevos envíos.", _queueName);

        try
        {
            await Task.Delay(Timeout.InfiniteTimeSpan, stoppingToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            // shutdown
        }
        finally
        {
            await processor.StopProcessingAsync(CancellationToken.None).ConfigureAwait(false);
        }
    }

    private async Task OnMessageAsync(ProcessMessageEventArgs args)
    {
        var logger = _logger;
        try
        {
            var json = Encoding.UTF8.GetString(args.Message.Body);
            var row = JsonSerializer.Deserialize<ShipmentRow>(json, JsonReadOpts);
            if (row is null || string.IsNullOrWhiteSpace(row.ShipmentId))
            {
                logger.LogWarning("Mensaje Service Bus inválido; se completa sin reintentar. MessageId={MessageId}", args.Message.MessageId);
                await args.CompleteMessageAsync(args.Message).ConfigureAwait(false);
                return;
            }

            await ShipmentInsertedEmailNotifier.TryNotifyAsync(row, logger, args.CancellationToken).ConfigureAwait(false);
            await args.CompleteMessageAsync(args.Message).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al procesar mensaje Service Bus; abandono para reintento.");
            await args.AbandonMessageAsync(args.Message).ConfigureAwait(false);
        }
    }

    private Task OnErrorAsync(ProcessErrorEventArgs args)
    {
        _logger.LogError(args.Exception, "Error Service Bus ({ErrorSource}): {FullyQualifiedNamespace}", args.ErrorSource, args.FullyQualifiedNamespace);
        return Task.CompletedTask;
    }
}
