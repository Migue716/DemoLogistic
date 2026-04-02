using System.Data;
using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
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

    /// <summary>PUT …/api/fn/shipments/{id} — actualiza la fila (dispara SqlTrigger).</summary>
    [Function(nameof(UpdateShipment))]
    public static async Task<HttpResponseData> UpdateShipment(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "fn/shipments/{id}")]
        HttpRequestData req,
        string id)
    {
        var body = await JsonSerializer.DeserializeAsync<ShipmentRow>(req.Body, JsonReadOpts);
        if (body is null || string.IsNullOrWhiteSpace(body.ShipmentId))
            throw new InvalidOperationException("Body JSON must include shipmentId, client, origin, destination, status, eta.");

        if (!string.Equals(body.ShipmentId, id, StringComparison.OrdinalIgnoreCase))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            bad.Headers.Add("Content-Type", "application/json; charset=utf-8");
            bad.WriteString("""{"error":"Route id and body shipmentId must match"}""");
            return bad;
        }

        await using var conn = new SqlConnection(GetSqlConnectionString());
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(
            """
            UPDATE dbo.Shipments
            SET Client = @Client, Origin = @Origin, Destination = @Destination, Status = @Status, Eta = @Eta
            WHERE ShipmentId = @ShipmentId
            """,
            conn);
        cmd.Parameters.Add("@ShipmentId", SqlDbType.VarChar, 20).Value = id;
        cmd.Parameters.Add("@Client", SqlDbType.NVarChar, 200).Value = body.Client;
        cmd.Parameters.Add("@Origin", SqlDbType.NVarChar, 200).Value = body.Origin;
        cmd.Parameters.Add("@Destination", SqlDbType.NVarChar, 200).Value = body.Destination;
        cmd.Parameters.Add("@Status", SqlDbType.NVarChar, 50).Value = body.Status;
        cmd.Parameters.Add("@Eta", SqlDbType.Date).Value = body.Eta.Date;

        var affected = await cmd.ExecuteNonQueryAsync();
        if (affected == 0)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            notFound.Headers.Add("Content-Type", "application/json; charset=utf-8");
            notFound.WriteString("""{"error":"Shipment not found"}""");
            return notFound;
        }

        var res = req.CreateResponse(HttpStatusCode.OK);
        res.Headers.Add("Content-Type", "application/json; charset=utf-8");
        res.WriteString(JsonSerializer.Serialize(body, JsonOpts));
        return res;
    }

    /// <summary>DELETE …/api/fn/shipments/{id} — borra la fila (dispara SqlTrigger).</summary>
    [Function(nameof(DeleteShipment))]
    public static async Task<HttpResponseData> DeleteShipment(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "fn/shipments/{id}")]
        HttpRequestData req,
        string id)
    {
        await using var conn = new SqlConnection(GetSqlConnectionString());
        await conn.OpenAsync();
        await using var cmd = new SqlCommand(
            "DELETE FROM dbo.Shipments WHERE ShipmentId = @ShipmentId",
            conn);
        cmd.Parameters.Add("@ShipmentId", SqlDbType.VarChar, 20).Value = id;

        var affected = await cmd.ExecuteNonQueryAsync();
        if (affected == 0)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            notFound.Headers.Add("Content-Type", "application/json; charset=utf-8");
            notFound.WriteString("""{"error":"Shipment not found"}""");
            return notFound;
        }

        var res = req.CreateResponse(HttpStatusCode.NoContent);
        return res;
    }

    private static string GetSqlConnectionString() =>
        Environment.GetEnvironmentVariable("SqlConnectionString")
        ?? throw new InvalidOperationException("SqlConnectionString is not configured.");
}
