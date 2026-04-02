# ShipTrack API — Referencia de endpoints

**Base URL (desarrollo):** `http://localhost:3000`  
**Documentación interactiva (solo Development):** `http://localhost:3000/swagger`  

Los datos salen de **SQL Server** (base **ShipTrack**). Crea tablas y datos con `Scripts/CreateShipTrack.sql`. La cadena de conexión va en `ConnectionStrings:ShipTrack` (`appsettings.json` / `appsettings.Development.json`).

Todas las respuestas son **JSON** con propiedades en **camelCase**. No requiere autenticación (demo).

---

## `GET /api`

Índice con la lista de rutas disponibles.

**Respuesta:** objeto con `name`, `version`, `dataSource` (`SQL Server`) y `endpoints`.

---

## `GET /api/health`

Comprobación rápida de que el servicio está vivo.

**Respuesta:** `200 OK`

```json
{ "ok": true }
```

---

## `GET /api/kpis`

Tarjetas KPI del dashboard.

**Respuesta:** `200 OK` — arreglo de objetos:

| Campo         | Tipo   |
|---------------|--------|
| `label`       | string |
| `value`       | string |
| `change`      | string |
| `changeLabel` | string |
| `icon`        | string |

---

## `GET /api/shipments/recent`

Envíos recientes (vista resumida).

**Respuesta:** `200 OK` — arreglo:

| Campo     | Tipo   |
|-----------|--------|
| `id`      | string |
| `company` | string |
| `status`  | string |
| `eta`     | string (fecha ISO `YYYY-MM-DD`) |

---

## `GET /api/shipments/by-status`

Conteos agregados por estado (gráficos / resumen).

**Respuesta:** `200 OK` — arreglo:

| Campo    | Tipo   |
|----------|--------|
| `status` | string |
| `count`  | number |
| `color`  | string (valor CSS, ej. `var(--success)`) |

---

## `GET /api/shipments`

Tabla completa de envíos, con filtros opcionales.

**Query (opcionales):**

| Parámetro | Descripción |
|-----------|-------------|
| `q`       | Busca en `id`, `client`, `origin`, `destination` (sin distinguir mayúsculas). |
| `status`  | Filtra filas cuyo `status` **contiene** el texto (sin distinguir mayúsculas). |

**Respuesta:** `200 OK` — arreglo:

| Campo         | Tipo   |
|---------------|--------|
| `id`          | string |
| `client`      | string |
| `origin`      | string |
| `destination` | string |
| `status`      | string |
| `eta`         | string |

**Ejemplos:**

- `GET /api/shipments`
- `GET /api/shipments?q=shanghai`
- `GET /api/shipments?status=Transit`
- `GET /api/shipments?q=corp&status=Pending`

---

## `GET /api/shipments/{id}`

Un envío por identificador (coincidencia exacta de `id`).

**Parámetros de ruta:**

| Parámetro | Descripción     |
|-----------|-----------------|
| `id`      | Ej. `SHP-2024-001` |

**Respuestas:**

- `200 OK` — mismo objeto que un elemento de `GET /api/shipments`.
- `404 Not Found` — `{ "error": "Shipment not found" }`

**Ejemplo:** `GET /api/shipments/SHP-2024-001`

---

## `GET /api/documents`

Lista de documentos (facturas, bills, certificados, etc.).

**Query (opcional):**

| Parámetro | Descripción |
|-----------|-------------|
| `type`    | Filtra por tipo exacto: `bill`, `invoice`, `certificate` (minúsculas en el filtro). |

**Respuesta:** `200 OK` — arreglo:

| Campo   | Tipo   |
|---------|--------|
| `title` | string |
| `date`  | string |
| `size`  | string |
| `type`  | string |

**Ejemplos:**

- `GET /api/documents`
- `GET /api/documents?type=invoice`

---

## CORS

Orígenes permitidos para el front en local:

- `http://localhost:4200`, `http://127.0.0.1:4200` (Angular)
- `http://localhost:5173`, `http://127.0.0.1:5173` (Vite / React)

Para otros orígenes, hay que ampliar la política en `Program.cs`.
