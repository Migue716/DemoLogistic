# ShipTrack - Versión Angular

Versión en **Angular 18** (standalone components) del proyecto ShipTrack, equivalente a la app React en la raíz del repositorio.

## Estructura

- **`src/app/app.config.ts`** – Configuración de la app (router, zone).
- **`src/app/app.routes.ts`** – Rutas con lazy loading de páginas.
- **`src/app/components/`** – Layout, Header, Sidebar.
- **`src/app/pages/`** – Dashboard, Shipments, Tracking, Documents, Analytics, Settings.
- **`src/app/data/mock.service.ts`** – Datos de prueba (inyectable).

## Cómo ejecutar

```bash
cd angular
npm install
npm start
```

La app se sirve en **http://localhost:4200**.

## Build de producción

```bash
npm run build
```

Los artefactos se generan en `dist/shiptrack-angular/`.

## Tecnologías

- Angular 18 (standalone components, signals, control flow `@if` / `@for` / `@switch`)
- Router con lazy loading
- CSS global con variables en `src/styles.css`
- Misma UI y datos mock que la versión React
