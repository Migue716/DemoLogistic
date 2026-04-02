namespace ShipTrack.Api;

public static class DummyData
{
    public static IReadOnlyList<KpiCardDto> KpiCards { get; } =
    [
        new("Active Shipments", "1,247", "+12%", "vs last week", "box"),
        new("In Transit", "892", "+8%", "vs last week", "truck"),
        new("In Customs", "156", "-3%", "vs last week", "customs"),
        new("Delivered Today", "43", "+22%", "vs last week", "check"),
    ];

    public static IReadOnlyList<RecentShipmentDto> RecentShipments { get; } =
    [
        new("SHP-2024-001", "Tech Solutions Inc", "In Transit", "2026-03-19"),
        new("SHP-2024-002", "Global Imports Ltd", "Customs", "2026-03-20"),
        new("SHP-2024-003", "Pacific Trading Co", "Delivered", "2026-03-17"),
        new("SHP-2024-004", "Euro Logistics", "In Transit", "2026-03-21"),
        new("SHP-2024-005", "Asia Pacific Ltd", "Pending", "2026-03-25"),
    ];

    public static IReadOnlyList<ShipmentByStatusDto> ShipmentByStatus { get; } =
    [
        new("Pending", 199, "var(--pending)"),
        new("In Transit", 892, "var(--success)"),
        new("In Customs", 156, "var(--warning)"),
        new("Delivered", 2341, "var(--info)"),
    ];

    public static IReadOnlyList<ShipmentRowDto> ShipmentsTable { get; } =
    [
        new("SHP-2024-001", "Tech Solutions Inc", "Shanghai, China", "Los Angeles, USA", "In Transit", "2026-03-19"),
        new("SHP-2024-002", "Global Imports Ltd", "Hamburg, Germany", "New York, USA", "Customs", "2026-03-20"),
        new("SHP-2024-003", "Pacific Trading Co", "Tokyo, Japan", "Seattle, USA", "Delivered", "2026-03-17"),
        new("SHP-2024-004", "Euro Logistics", "Rotterdam, Netherlands", "Chicago, USA", "In Transit", "2026-03-21"),
        new("SHP-2024-005", "Asia Pacific Ltd", "Singapore", "San Francisco, USA", "Pending", "2026-03-25"),
        new("SHP-2024-006", "Nordic Cargo", "Oslo, Norway", "Boston, USA", "In Transit", "2026-03-22"),
        new("SHP-2024-007", "Mediterranean Freight", "Barcelona, Spain", "Miami, USA", "Customs", "2026-03-23"),
    ];

    public static IReadOnlyList<DocumentItemDto> DocumentsList { get; } =
    [
        new("Bill of Lading - SHP-2024-001", "2026-03-10", "2.4 MB", "bill"),
        new("Commercial Invoice - SHP-2024-002", "2026-03-11", "1.8 MB", "invoice"),
        new("Packing List - SHP-2024-003", "2026-03-12", "956 KB", "invoice"),
        new("Certificate of Origin - SHP-2024-004", "2026-03-13", "1.2 MB", "certificate"),
        new("Customs Declaration - SHP-2024-005", "2026-03-14", "3.1 MB", "bill"),
        new("Insurance Certificate - SHP-2024-006", "2026-03-15", "1.5 MB", "certificate"),
    ];
}

public record KpiCardDto(string Label, string Value, string Change, string ChangeLabel, string Icon);

public record RecentShipmentDto(string Id, string Company, string Status, string Eta);

public record ShipmentByStatusDto(string Status, int Count, string Color);

public record ShipmentRowDto(string Id, string Client, string Origin, string Destination, string Status, string Eta);

public record DocumentItemDto(string Title, string Date, string Size, string Type);
