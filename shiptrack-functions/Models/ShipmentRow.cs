namespace ShipTrack.Functions.Models;

/// <summary>Coincide con columnas de dbo.Shipments (SQL trigger / output binding).</summary>
public class ShipmentRow
{
    public string ShipmentId { get; set; } = "";
    public string Client { get; set; } = "";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime Eta { get; set; }
}
