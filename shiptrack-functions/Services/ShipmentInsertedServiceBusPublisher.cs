using System.Text;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Logging;
using ShipTrack.Functions.Models;

namespace ShipTrack.Functions.Services;

/// <summary>
/// Publica en la cola de Service Bus un mensaje por cada envío insertado.
/// </summary>
public static class ShipmentInsertedServiceBusPublisher
{
    private const string ConnectionSetting = "ShipmentServiceBus";
    private const string QueueSetting = "ShipmentInsertedQueueName";

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public static async Task TryPublishAsync(ShipmentRow row, ILogger logger, CancellationToken cancellationToken = default)
    {
        var connection = Environment.GetEnvironmentVariable(ConnectionSetting);
        if (string.IsNullOrWhiteSpace(connection))
        {
            logger.LogDebug("Service Bus omitido: falta {Setting}.", ConnectionSetting);
            return;
        }

        var queue = Environment.GetEnvironmentVariable(QueueSetting);
        if (string.IsNullOrWhiteSpace(queue))
            queue = "shipment-inserted";

        var body = JsonSerializer.Serialize(row, JsonOpts);
        try
        {
            await using var client = new ServiceBusClient(connection);
            await using var sender = client.CreateSender(queue);
            await sender.SendMessageAsync(
                    new ServiceBusMessage(Encoding.UTF8.GetBytes(body))
                    {
                        ContentType = "application/json",
                        Subject = "ShipmentInserted",
                    },
                    cancellationToken)
                .ConfigureAwait(false);
            logger.LogInformation(
                "Mensaje de nuevo envío publicado en Service Bus (cola {Queue}, ShipmentId={ShipmentId}).",
                queue,
                row.ShipmentId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "No se pudo publicar en Service Bus para ShipmentId={ShipmentId}.", row.ShipmentId);
        }
    }
}
