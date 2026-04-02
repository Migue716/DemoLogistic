# Arquitectura — DemoLogistic / ShipTrack

Diagramas en [Mermaid](https://mermaid.js.org/). En GitHub/GitLab se muestran al previsualizar el archivo.

---

## Vista de componentes (desarrollo local)

```mermaid
flowchart TB
  subgraph clients["Clientes (navegador)"]
    A["Angular 18\n:4200"]
    R["React + Vite\n:5173"]
  end

  subgraph backend["Backend .NET 8"]
    API["shiptrack-api\nREST Minimal API\n:3000"]
    FN["shiptrack-functions\nAzure Functions\n:7071"]
  end

  DB[("SQL Server\nBase ShipTrack\ndbo.Shipments, …")]

  A -->|"HTTP JSON\n/api/*"| API
  R -->|"HTTP JSON\n/api/*"| API
  API -->|"EF Core\nConnectionStrings:ShipTrack"| DB

  FN -->|"SqlInput / SqlOutput /\nSqlClient (PUT/DELETE)\nSqlConnectionString"| DB
  FN -.->|"SqlTrigger\nChange Tracking"| DB
```

Rutas HTTP de Functions: `/api/fn/shipments`, `/api/fn/shipments/{id}` (GET/POST/PUT/DELETE).

Los frontends **no** llaman a Functions en el flujo principal del demo: consumen la **API** en el puerto **3000**. Functions comparte la **misma base** y expone CRUD HTTP alternativo bajo **`/api/fn/...`**.

---

## Flujo de datos: dashboards y tablas (Angular / React → API)

```mermaid
sequenceDiagram
  participant UI as Angular o React
  participant API as shiptrack-api
  participant DB as SQL Server

  UI->>API: GET /api/kpis, /recent, /by-status, …
  API->>DB: Consultas EF Core
  DB-->>API: Filas
  API-->>UI: JSON camelCase
```

---

## Flujo: Azure Functions y SQL

```mermaid
flowchart LR
  subgraph http["HTTP Functions"]
    G[GET lista / por id]
    P[POST insert\nSqlOutput]
    U[PUT update\nSqlClient]
    D[DELETE\nSqlClient]
  end

  T["ShipmentSqlTrigger\n(SqlTrigger)"]

  DB[("dbo.Shipments")]

  G --> DB
  P --> DB
  U --> DB
  D --> DB
  DB --> T
  T --> L["Logs Information\noperación + fila"]
```

El **SqlTrigger** reacciona a cambios en **`dbo.Shipments`** (INSERT/UPDATE/DELETE en base) y los registra; el **POST** usa enlace **`SqlOutput`**; **PUT/DELETE** usan **`Microsoft.Data.SqlClient`** con la misma cadena **`SqlConnectionString`**.

---

## Despliegue lógico (referencia)

```mermaid
flowchart TB
  subgraph azure["Azure (ejemplo)"]
    SWA["Static Web Apps / App Service\nAngular o React build"]
    ASP["App Service / Container\nshiptrack-api"]
    FA["Function App\nshiptrack-functions"]
    SQL[("Azure SQL\nShipTrack")]
  end

  SWA --> ASP
  ASP --> SQL
  FA --> SQL
```

En local, los cuatro procesos sustituyen a esos servicios; la **única fuente de verdad** relacional es la base **ShipTrack**.

---

## Puertos por defecto

| Servicio | Puerto típico |
|----------|----------------|
| shiptrack-api | 3000 |
| Angular `ng serve` | 4200 |
| React `vite` | 5173 |
| Azure Functions Core Tools | 7071 |

Si un puerto está ocupado, CLI puede elegir otro (`--port` en Angular, Vite incremental, etc.).
