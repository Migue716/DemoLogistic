using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShipTrack.Functions.Services;

var builder = new HostBuilder().ConfigureFunctionsWorkerDefaults();

if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ShipmentServiceBus")))
    builder.ConfigureServices(s => s.AddHostedService<ShipmentInsertedQueueWorker>());

var host = builder.Build();
host.Run();
