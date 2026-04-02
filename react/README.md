# ShipTrack

Dashboard de seguimiento de envíos en React, con diseño similar al de las capturas que compartiste.

## Contenido

- **Dashboard**: KPIs (Active Shipments, In Transit, In Customs, Delivered Today), envíos recientes y gráfico por estado.
- **Shipments**: Tabla con búsqueda, filtro y exportación a CSV.
- **Documents**: Pestañas (All, Bills of Lading, Invoices, Certificates) y lista de documentos con descarga.
- **Settings**: Perfil, preferencias (idioma, zona horaria, formato de fecha), notificaciones y suscripción.
- **Tracking** y **Analytics**: páginas placeholder listas para conectar tu lógica o APIs.

## Cómo ejecutarlo

Arranca la API .NET (`../shiptrack-api`, `dotnet run`, puerto **3000**). Luego:

```bash
cd react
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). La URL de la API se define con **`VITE_API_URL`** (por defecto `http://localhost:3000` vía `.env.development` y `src/config.js`).

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 18
- React Router 6
- Vite 5
- CSS Modules (sin UI library)

**Dashboard**, **Shipments** y **Documents** consumen la REST API (`src/api/shiptrackApi.js`). `src/data/mock.js` queda como referencia offline.
