using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Extensions.Logging;
using ShipTrack.Functions.Models;

namespace ShipTrack.Functions;

/// <summary>
/// Se ejecuta cuando hay INSERT/UPDATE/DELETE en dbo.Shipments (requiere Change Tracking en la BD).
/// </summary>
public class ShipmentSqlTrigger
{
    [Function(nameof(ShipmentSqlTrigger))]
    public void Run(
        [SqlTrigger("[dbo].[Shipments]", "SqlConnectionString")]
        IReadOnlyList<SqlChange<ShipmentRow>> changes,
        FunctionContext context)
    {
        var logger = context.GetLogger(nameof(ShipmentSqlTrigger));
        foreach (var change in changes)
        {
            var row = change.Item;
            logger.LogInformation(
                "SQL change: {Operation} ShipmentId={ShipmentId} Client={Client} Status={Status} Eta={Eta:yyyy-MM-dd}",
                change.Operation,
                row.ShipmentId,
                row.Client,
                row.Status,
                row.Eta);
        }
    }
}
