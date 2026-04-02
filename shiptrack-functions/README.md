# ShipTrack — Azure Functions (SQL)

Funciones **.NET 8** (worker aislado) con enlaces **Azure SQL**:

| Función | Tipo | Descripción |
|---------|------|-------------|
| `ShipmentSqlTrigger` | **SqlTrigger** | Registra en logs cada INSERT/UPDATE/DELETE en `dbo.Shipments`. |
| `GetShipments` | HTTP + **SqlInput** | `GET /api/fn/shipments` — lista envíos. |
| `GetShipmentById` | HTTP + **SqlInput** | `GET /api/fn/shipments/{id}` — un envío. |
| `InsertShipment` | HTTP + **SqlOutput** | `POST /api/fn/shipments` — inserta fila (JSON con `shipmentId`, `client`, `origin`, `destination`, `status`, `eta`). |

## Requisitos

- Base **ShipTrack** creada (`shiptrack-api/Scripts/CreateShipTrack.sql`).
- **Change Tracking** (`shiptrack-api/Scripts/EnableChangeTracking.sql`) — obligatorio para el trigger.
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) **v4** (recomendado) o ejecutar con `dotnet run` si el host está configurado.
- Cadena `SqlConnectionString` en `local.settings.json` (misma instancia que la API).

## Ejecución local

```bash
cd shiptrack-functions
dotnet build
func start
```

URL base suele ser `http://localhost:7071`. Rutas completas: `http://localhost:7071/api/fn/shipments`.

Si no tienes `func`, prueba:

```bash
dotnet run
```

## POST de ejemplo

```http
POST http://localhost:7071/api/fn/shipments
Content-Type: application/json

{
  "shipmentId": "SHP-2024-099",
  "client": "Demo Corp",
  "origin": "Madrid, Spain",
  "destination": "Mexico City, Mexico",
  "status": "Pending",
  "eta": "2026-06-01"
}
```

Tras el insert, el **SqlTrigger** debería escribir una línea de log con la operación `Insert`.

## Notas

- El trigger usa sondeo periódico sobre Change Tracking; no es notificación instantánea en milisegundos.
- En Azure, usar **Azure SQL** (o SQL Managed Instance) y configurar la cadena de conexión en **Application Settings** de la Function App. Managed Identity es el enfoque recomendado en producción.
