using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ShipTrack.Api;
using ShipTrack.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddDbContext<ShipTrackDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ShipTrack")));

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
        Description = "API REST ShipTrack; datos en SQL Server (base ShipTrack).",
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
    dataSource = "SQL Server",
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

app.MapGet("/api/kpis", async (ShipTrackDbContext db) =>
{
    var list = await db.KpiCards.AsNoTracking()
        .OrderBy(x => x.SortOrder)
        .Select(x => new KpiCardDto(x.Label, x.Value, x.MetricChange, x.ChangeLabel, x.Icon))
        .ToListAsync();
    return Results.Json(list);
});

app.MapGet("/api/shipments/recent", async (ShipTrackDbContext db) =>
{
    var list = await (
        from r in db.RecentShipments.AsNoTracking()
        join s in db.Shipments.AsNoTracking() on r.ShipmentId equals s.ShipmentId
        orderby r.SortOrder
        select new RecentShipmentDto(s.ShipmentId, s.Client, s.Status, s.Eta.ToString("yyyy-MM-dd"))
    ).ToListAsync();
    return Results.Json(list);
});

app.MapGet("/api/shipments/by-status", async (ShipTrackDbContext db) =>
{
    var list = await db.ShipmentByStatus.AsNoTracking()
        .OrderBy(x => x.SortOrder)
        .Select(x => new ShipmentByStatusDto(x.Status, x.Count, x.Color))
        .ToListAsync();
    return Results.Json(list);
});

app.MapGet("/api/shipments", async (string? q, string? status, ShipTrackDbContext db) =>
{
    IQueryable<ShipmentEntity> query = db.Shipments.AsNoTracking();

    if (!string.IsNullOrWhiteSpace(status))
    {
        var s = status.Trim();
        query = query.Where(r => r.Status.Contains(s));
    }

    if (!string.IsNullOrWhiteSpace(q))
    {
        var needle = q.Trim();
        query = query.Where(r =>
            r.ShipmentId.Contains(needle) ||
            r.Client.Contains(needle) ||
            r.Origin.Contains(needle) ||
            r.Destination.Contains(needle));
    }

    var rows = await query
        .OrderBy(r => r.ShipmentId)
        .Select(r => new ShipmentRowDto(
            r.ShipmentId,
            r.Client,
            r.Origin,
            r.Destination,
            r.Status,
            r.Eta.ToString("yyyy-MM-dd")))
        .ToListAsync();
    return Results.Json(rows);
});

app.MapGet("/api/shipments/{id}", async (string id, ShipTrackDbContext db) =>
{
    var row = await db.Shipments.AsNoTracking()
        .Where(r => r.ShipmentId == id)
        .Select(r => new ShipmentRowDto(
            r.ShipmentId,
            r.Client,
            r.Origin,
            r.Destination,
            r.Status,
            r.Eta.ToString("yyyy-MM-dd")))
        .FirstOrDefaultAsync();
    return row is null
        ? Results.NotFound(new { error = "Shipment not found" })
        : Results.Json(row);
});

app.MapGet("/api/documents", async (string? type, ShipTrackDbContext db) =>
{
    IQueryable<DocumentEntity> query = db.Documents.AsNoTracking();
    if (!string.IsNullOrWhiteSpace(type))
    {
        var t = type.Trim().ToLowerInvariant();
        query = query.Where(d => d.DocType == t);
    }

    var list = await query
        .OrderBy(d => d.Id)
        .Select(d => new DocumentItemDto(
            d.Title,
            d.DocDate.ToString("yyyy-MM-dd"),
            d.SizeLabel,
            d.DocType))
        .ToListAsync();
    return Results.Json(list);
});

app.Run();
