# ShipTrack — Azure Functions (SQL)

Funciones **.NET 8** (worker aislado) con enlaces **Azure SQL**:

| Función | Tipo | Descripción |
|---------|------|-------------|
| `ShipmentSqlTrigger` | **SqlTrigger** | Registra cambios en `dbo.Shipments`. En **INSERT**: si existe `ShipmentServiceBus`, **publica en la cola**; si no, puede enviar **correo SMTP** directo (`ShipmentNotify*`). |
| *(worker en segundo plano)* | **Service Bus** | Si `ShipmentServiceBus` está definido, un `BackgroundService` consume la cola y envía el **correo** (mismas claves `ShipmentNotify*`). |
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

Tras el insert, el **SqlTrigger** debería escribir una línea de log con la operación `Insert` y, según configuración, publicar en Service Bus o enviar correo.

## Azure Service Bus (opcional)

Flujo con cola:

1. **INSERT** en `dbo.Shipments` → `ShipmentSqlTrigger` serializa el envío a JSON y lo envía a la cola (por defecto `shipment-inserted`).
2. El **`ShipmentInsertedQueueWorker`** (solo se arranca si existe `ShipmentServiceBus`) recibe el mensaje y llama al mismo envío de correo SMTP que antes.

| Clave | Descripción |
|--------|-------------|
| `ShipmentServiceBus` | Cadena de conexión del namespace (policy con **Send/Listen** sobre la cola, o `RootManageSharedAccessKey` en dev). Si **no** está definida, no hay Service Bus: el trigger usa solo el camino de correo directo. |
| `ShipmentInsertedQueueName` | Nombre de la cola (opcional; por defecto `shipment-inserted`). Debes **crear la cola** en el portal o CLI antes de probar. |

En Azure Function App, define las mismas *application settings* y mantén `ShipmentNotify*` para que el worker pueda enviar el correo al consumir el mensaje.

## Correo al insertar un envío

**Sin Service Bus:** si **no** defines `ShipmentServiceBus`, cada **INSERT** puede disparar un correo **directamente desde el trigger** cuando configures **servidor SMTP** y **destinatario** (`ShipmentNotify*`).

**Con Service Bus:** el trigger **solo publica**; el correo lo envía el **worker** al procesar el mensaje (configura igualmente `ShipmentNotify*`).

| Clave | Descripción |
|--------|-------------|
| `ShipmentNotifyTo` | Email del destinatario (**obligatorio** para activar el envío). |
| `ShipmentNotifySmtpHost` | Host SMTP (**obligatorio** para activar). |
| `ShipmentNotifySmtpPort` | Puerto (por defecto **587**). |
| `ShipmentNotifyFrom` | Remitente; si se omite, se usa `ShipmentNotifyTo`. |
| `ShipmentNotifySmtpUser` | Usuario SMTP (opcional si el servidor no exige auth). |
| `ShipmentNotifySmtpPassword` | Contraseña o secreto SMTP. |
| `ShipmentNotifySmtpDisableSsl` | `true` para desactivar TLS (solo pruebas; no recomendado en producción). |

Si faltan `ShipmentNotifyTo` o `ShipmentNotifySmtpHost`, el trigger solo escribe en log (nivel Debug) y no intenta enviar.

Ejemplo para `Values` en `local.settings.json` (usa credenciales reales; no subas secretos al repo):

```json
"ShipmentNotifyTo": "ops@tu-dominio.com",
"ShipmentNotifyFrom": "shiptrack@tu-dominio.com",
"ShipmentNotifySmtpHost": "smtp.office365.com",
"ShipmentNotifySmtpPort": "587",
"ShipmentNotifySmtpUser": "shiptrack@tu-dominio.com",
"ShipmentNotifySmtpPassword": "TU_SECRETO"
```

En Azure, guarda la contraseña en un **Key Vault** referenciado por la app setting o usa **SendGrid / ACS** con otro código si lo preferís; este ejemplo usa SMTP genérico (MailKit).

## Notas

- El trigger usa sondeo periódico sobre Change Tracking; no es notificación instantánea en milisegundos.
- En Azure, usar **Azure SQL** (o SQL Managed Instance) y configurar la cadena de conexión en **Application Settings** de la Function App. Managed Identity es el enfoque recomendado en producción.
