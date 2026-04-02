using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker.Http;
using ShipTrack.Functions.Models;

namespace ShipTrack.Functions;

public static class ShipmentHttpFunctions
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private static readonly JsonSerializerOptions JsonReadOpts = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    /// <summary>GET …/api/fn/shipments — lista todos los envíos desde SQL.</summary>
    [Function(nameof(GetShipments))]
    public static HttpResponseData GetShipments(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "fn/shipments")]
        HttpRequestData req,
        [SqlInput(
            "SELECT ShipmentId, Client, Origin, Destination, Status, Eta FROM dbo.Shipments ORDER BY ShipmentId",
            "SqlConnectionString")]
        IEnumerable<ShipmentRow> rows)
    {
        var res = req.CreateResponse(HttpStatusCode.OK);
        res.Headers.Add("Content-Type", "application/json; charset=utf-8");
        res.WriteString(JsonSerializer.Serialize(rows, JsonOpts));
        return res;
    }

    /// <summary>GET …/api/fn/shipments/{id} — un envío por ShipmentId.</summary>
    [Function(nameof(GetShipmentById))]
    public static HttpResponseData GetShipmentById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "fn/shipments/{id}")]
        HttpRequestData req,
        string id,
        [SqlInput(
            "SELECT ShipmentId, Client, Origin, Destination, Status, Eta FROM dbo.Shipments WHERE ShipmentId = @Id",
            "SqlConnectionString",
            parameters: "@Id={id}")]
        IEnumerable<ShipmentRow> rows)
    {
        var row = rows.FirstOrDefault();
        if (row is null)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            notFound.Headers.Add("Content-Type", "application/json; charset=utf-8");
            notFound.WriteString("""{"error":"Shipment not found"}""");
            return notFound;
        }

        var res = req.CreateResponse(HttpStatusCode.OK);
        res.Headers.Add("Content-Type", "application/json; charset=utf-8");
        res.WriteString(JsonSerializer.Serialize(row, JsonOpts));
        return res;
    }

    /// <summary>POST …/api/fn/shipments — inserta una fila en dbo.Shipments (dispara el SqlTrigger).</summary>
    [Function(nameof(InsertShipment))]
    [SqlOutput("dbo.Shipments", "SqlConnectionString")]
    public static async Task<ShipmentRow> InsertShipment(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "fn/shipments")]
        HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<ShipmentRow>(req.Body, JsonReadOpts);
        if (body is null || string.IsNullOrWhiteSpace(body.ShipmentId))
            throw new InvalidOperationException("Body JSON must include shipmentId, client, origin, destination, status, eta.");

        return body;
    }
}
