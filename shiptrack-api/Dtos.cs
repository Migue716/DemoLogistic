namespace ShipTrack.Api;

public record KpiCardDto(string Label, string Value, string Change, string ChangeLabel, string Icon);

public record RecentShipmentDto(string Id, string Company, string Status, string Eta);

public record ShipmentByStatusDto(string Status, int Count, string Color);

public record ShipmentRowDto(string Id, string Client, string Origin, string Destination, string Status, string Eta);

public record DocumentItemDto(string Title, string Date, string Size, string Type);
