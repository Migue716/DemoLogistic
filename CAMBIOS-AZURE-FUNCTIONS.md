# Azure Functions — ShipTrack (`shiptrack-functions/`)

Documento de referencia sobre el proyecto **Azure Functions** del demo logístico: stack, funciones HTTP (lectura/escritura sobre `dbo.Shipments`), disparador SQL y pruebas locales.

---

## Stack y proyecto

| Elemento | Valor |
|----------|--------|
| Runtime | **Azure Functions v4**, worker **.NET aislado** (`dotnet-isolated`) |
| Framework | **.NET 8** (`net8.0`), salida **Exe** |
| Paquetes clave | `Microsoft.Azure.Functions.Worker` 1.24.0, `Worker.Extensions.Http` 3.3.0, `Worker.Extensions.Sql` 3.1.527, `Microsoft.Data.SqlClient` 5.2.2, **`Azure.Messaging.ServiceBus` 7.18**, **`MailKit` 4.9** |
| Host | `Program.cs` con `HostBuilder` + `ConfigureFunctionsWorkerDefaults()` |

`host.json` usa **extension bundle** `[4.*, 5.0.0)` y nivel de log `Information` por defecto.

---

## Modelo de datos (`Models/ShipmentRow.cs`)

Mapea columnas de **`dbo.Shipments`** usadas por enlaces SQL y el trigger:

- `ShipmentId`, `Client`, `Origin`, `Destination`, `Status`, `Eta` (`DateTime`)

La API HTTP serializa respuestas en **JSON camelCase** (`JsonSerializerOptions`).

---

## Funciones HTTP (`ShipmentHttpFunctions.cs`)

Todas usan **`AuthorizationLevel.Anonymous`** y ruta bajo el prefijo de Functions (`/api/...`). Base local típica: **`http://localhost:7071`**.

| Función | Método | Ruta efectiva | Implementación | Comportamiento |
|---------|--------|---------------|----------------|----------------|
| `GetShipments` | GET | `/api/fn/shipments` | **SqlInput** — `SELECT` ordenado por `ShipmentId` | 200 + JSON array |
| `GetShipmentById` | GET | `/api/fn/shipments/{id}` | **SqlInput** — `WHERE ShipmentId = @Id` (`parameters: "@Id={id}"`) | 200 + objeto; **404** si no existe |
| `InsertShipment` | POST | `/api/fn/shipments` | **SqlOutput** → `dbo.Shipments` | Inserta desde body; body inválido → `InvalidOperationException` |
| `UpdateShipment` | PUT | `/api/fn/shipments/{id}` | **`SqlCommand`** (`Microsoft.Data.SqlClient`) | **400** si `shipmentId` del body ≠ `{id}`; **404** si no hay fila; **200** + JSON del envío actualizado |
| `DeleteShipment` | DELETE | `/api/fn/shipments/{id}` | **`SqlCommand`** | **404** si no hay fila; **204** sin cuerpo si OK |

- **SqlInput / SqlOutput** usan el setting **`SqlConnectionString`** (enlace declarativo).
- **PUT / DELETE** leen la misma cadena con `Environment.GetEnvironmentVariable("SqlConnectionString")`.

POST, PUT y DELETE disparan el **SqlTrigger** si Change Tracking está activo.

---

## Disparador SQL (`ShipmentSqlTrigger.cs`)

| Elemento | Detalle |
|----------|---------|
| Tipo | **`[SqlTrigger]`** sobre tabla **`[dbo].[Shipments]`** |
| Conexión | Mismo setting **`SqlConnectionString`** |
| Payload | `IReadOnlyList<SqlChange<ShipmentRow>>` |
| Efecto | Por cada cambio, **log** `Information` con operación (INSERT/UPDATE/DELETE), `ShipmentId`, `Client`, `Status`, `Eta`. En **INSERT**: si existe `ShipmentServiceBus`, **publica** JSON del envío en la cola (`ShipmentInsertedQueueName`, default `shipment-inserted`); un **BackgroundService** consume la cola y envía **correo SMTP** (MailKit, `ShipmentNotify*`). Sin Service Bus, el correo puede enviarse **desde el trigger** si `ShipmentNotify*` está configurado. |

**Requisito en SQL Server:** [Change Tracking](https://learn.microsoft.com/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server) habilitado en la base y en la tabla (`shiptrack-api/Scripts/EnableChangeTracking.sql`).

---

## Configuración local (`local.settings.json`)

| Clave | Uso |
|-------|-----|
| `FUNCTIONS_WORKER_RUNTIME` | `dotnet-isolated` |
| `AzureWebJobsStorage` | Por defecto `UseDevelopmentStorage=true` (Azurite / emulador si aplica) |
| `SqlConnectionString` | Conexión a la base **ShipTrack** (ej. LocalDB en el template del repo) |

`local.settings.json` está configurado para **no** copiarse al publicar (`CopyToPublishDirectory: Never` en el `.csproj`).

---

## Cómo ejecutar en local

```bash
cd shiptrack-functions
func start
```

Alternativa: `dotnet run` (misma app worker).

BD: `shiptrack-api/Scripts/CreateShipTrack.sql`. Para el trigger: **`EnableChangeTracking.sql`**.

---

## Pruebas HTTP (PowerShell)

Sustituye el host si tu `func start` usa otro puerto.

### GET — listar

```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/fn/shipments" -Method Get
```

### GET — por id

```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/fn/shipments/SHP-2024-001" -Method Get
```

### POST — insertar

```powershell
$body = @{
  shipmentId  = "SHP-TEST-001"
  client      = "Demo Client"
  origin      = "Madrid"
  destination = "Lisboa"
  status      = "Pending"
  eta         = "2026-04-15"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/fn/shipments" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
```

### PUT — actualizar

El **`shipmentId` del JSON debe coincidir** con el `{id}` de la URL.

```powershell
$body = @{
  shipmentId  = "SHP-TEST-001"
  client      = "Demo Client SA"
  origin      = "Madrid"
  destination = "Oporto"
  status      = "In Transit"
  eta         = "2026-04-16"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/fn/shipments/SHP-TEST-001" -Method Put -Body $body -ContentType "application/json; charset=utf-8"
```

### DELETE — borrar

```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/fn/shipments/SHP-TEST-001" -Method Delete
```

**Nota:** evita borrar `ShipmentId` referenciados por `dbo.RecentShipments` (p. ej. `SHP-2024-001`…`005` en el script de creación). Para pruebas destructivas, usa filas que insertes tú (p. ej. `SHP-TEST-001`).

---

## Relación con el resto del demo

- La **API principal** (`shiptrack-api`) expone `/api/...` en el puerto configurado (p. ej. 3000).
- Las **Functions** exponen **`/api/fn/...`** en el host de Functions (puerto por defecto **7071** con `func start`), sobre la misma tabla **`dbo.Shipments`**.

Detalle de integración en el monorepo: `IMPLEMENTACION.md` (sección Azure Functions).
