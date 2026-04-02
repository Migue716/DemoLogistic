using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using ShipTrack.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://127.0.0.1:4200",
                "http://localhost:5173",
                "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ShipTrack API",
        Version = "v1",
        Description = "API REST con datos dummy para el demo ShipTrack.",
    });
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShipTrack API v1");
        c.RoutePrefix = "swagger";
    });
}

app.MapGet("/api", () => Results.Json(new
{
    name = "ShipTrack API",
    version = "1.0.0",
    endpoints = new
    {
        health = "GET /api/health",
        kpis = "GET /api/kpis",
        recentShipments = "GET /api/shipments/recent",
        shipmentByStatus = "GET /api/shipments/by-status",
        shipments = "GET /api/shipments?q=&status=",
        shipmentById = "GET /api/shipments/{id}",
        documents = "GET /api/documents?type=",
    },
}));

app.MapGet("/api/health", () => Results.Json(new { ok = true }));

app.MapGet("/api/kpis", () => Results.Json(DummyData.KpiCards));

app.MapGet("/api/shipments/recent", () => Results.Json(DummyData.RecentShipments));

app.MapGet("/api/shipments/by-status", () => Results.Json(DummyData.ShipmentByStatus));

app.MapGet("/api/shipments", (string? q, string? status) =>
{
    IEnumerable<ShipmentRowDto> rows = DummyData.ShipmentsTable;

    if (!string.IsNullOrWhiteSpace(status))
    {
        var s = status.Trim();
        rows = rows.Where(r => r.Status.Contains(s, StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(q))
    {
        var needle = q.Trim();
        rows = rows.Where(r =>
            r.Id.Contains(needle, StringComparison.OrdinalIgnoreCase) ||
            r.Client.Contains(needle, StringComparison.OrdinalIgnoreCase) ||
            r.Origin.Contains(needle, StringComparison.OrdinalIgnoreCase) ||
            r.Destination.Contains(needle, StringComparison.OrdinalIgnoreCase));
    }

    return Results.Json(rows.ToList());
});

app.MapGet("/api/shipments/{id}", (string id) =>
{
    var row = DummyData.ShipmentsTable.FirstOrDefault(r => r.Id == id);
    return row is null
        ? Results.NotFound(new { error = "Shipment not found" })
        : Results.Json(row);
});

app.MapGet("/api/documents", (string? type) =>
{
    if (!string.IsNullOrWhiteSpace(type))
    {
        var t = type.Trim().ToLowerInvariant();
        return Results.Json(DummyData.DocumentsList.Where(d => d.Type == t).ToList());
    }

    return Results.Json(DummyData.DocumentsList);
});

app.Run();
