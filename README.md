# DemoLogistic — ShipTrack

Demo de **seguimiento logístico** con dos frontends (Angular y React), una **API REST en .NET 8** y datos en **SQL Server** (base `ShipTrack`).

## Estructura del repositorio

| Carpeta | Descripción |
|---------|-------------|
| `shiptrack-api/` | API ASP.NET Core (Minimal API, EF Core, Swagger). Puerto por defecto **3000**. |
| `angular/` | App Angular 18 (Dashboard, Shipments, Documents conectados a la API). Puerto **4200**. |
| `react/` | App React + Vite (mismas pantallas contra la API). Puerto **5173**. |

## Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS recomendado)
- SQL Server o **LocalDB** (incluido con Visual Studio / SQL Server Express)

## 1. Base de datos

Ejecuta el script en SSMS o `sqlcmd` (conectado a tu instancia, p. ej. `(localdb)\MSSQLLocalDB`):

`shiptrack-api/Scripts/CreateShipTrack.sql`

Crea la base **ShipTrack**, las tablas y los datos iniciales.

## 2. API

```bash
cd shiptrack-api
dotnet run
```

- API: http://localhost:3000  
- Swagger (Development): http://localhost:3000/swagger  

La cadena de conexión está en `appsettings.json` / `appsettings.Development.json` (`ConnectionStrings:ShipTrack`). Debe apuntar a la base **ShipTrack**.

Si al hacer `dotnet run` aparece error de archivo bloqueado, cierra otras instancias de la API o ejecuta:

`taskkill /IM ShipTrack.Api.exe /F`

## 3. Frontend (elige uno o ambos)

**Angular**

```bash
cd angular
npm install
npm start
```

→ http://localhost:4200  

**React**

```bash
cd react
npm install
npm run dev
```

→ http://localhost:5173  

En React, la URL de la API se configura con `VITE_API_URL` (ver `.env.development` y `src/config.js`).

## Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| [IMPLEMENTACION.md](IMPLEMENTACION.md) | Detalle de la integración Angular / React ↔ API. |
| [shiptrack-api/API.md](shiptrack-api/API.md) | Referencia de endpoints REST. |
| `angular/README.md` | Notas específicas del proyecto Angular. |
| `react/README.md` | Notas específicas del proyecto React. |

## Stack resumido

- **Backend:** ASP.NET Core 8, Entity Framework Core, SQL Server  
- **Angular:** 18, standalone, signals, `HttpClient`  
- **React:** 18, Vite 5, React Router 6, `fetch`  
- **CORS:** la API permite orígenes `localhost:4200` y `localhost:5173`
