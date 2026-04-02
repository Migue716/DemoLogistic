# ShipTrack - Versión Angular

Versión en **Angular 18** (standalone components) del proyecto ShipTrack, equivalente a la app React en la raíz del repositorio.

## Estructura

- **`src/app/app.config.ts`** – Configuración de la app (router, zone).
- **`src/app/app.routes.ts`** – Rutas con lazy loading de páginas.
- **`src/app/components/`** – Layout, Header, Sidebar.
- **`src/app/pages/`** – Dashboard, Shipments, Tracking, Documents, Analytics, Settings.
- **`src/app/data/shiptrack-api.service.ts`** – Cliente HTTP hacia la API .NET (`/api/...`).
- **`src/app/data/shiptrack.models.ts`** – Tipos compartidos.
- **`src/app/data/mock.service.ts`** – Datos estáticos opcionales (sin API).
- **`src/environments/`** – `apiUrl` (por defecto `http://localhost:3000`).

## Cómo ejecutar

Arranca antes la API .NET (`shiptrack-api`, `dotnet run` en el puerto **3000**). Luego:

```bash
cd angular
npm install
npm start
```

La app se sirve en **http://localhost:4200** (CORS ya permitido en la API).

## Build de producción

```bash
npm run build
```

Los artefactos se generan en `dist/shiptrack-angular/`.

## Tecnologías

- Angular 18 (standalone components, signals, control flow `@if` / `@for` / `@switch`)
- Router con lazy loading
- CSS global con variables en `src/styles.css`
- Dashboard, Shipments y Documents consumen la **API REST**; Settings sigue en estado local
