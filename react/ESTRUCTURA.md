# Estructura del código - ShipTrack (DemoLogistic)

Este documento describe la organización del proyecto y el papel de cada parte del código.

---

## Visión general

**ShipTrack** es una aplicación de seguimiento de envíos (logística) construida con:

- **React 18** – interfaz de usuario
- **Vite 5** – build y servidor de desarrollo
- **React Router v6** – rutas y navegación
- **CSS Modules** – estilos por componente

El código usa **módulos ES** (`"type": "module"` en `package.json`).

---

## Árbol de carpetas (código fuente)

```
DemoLogistic/
├── index.html              # Punto de entrada HTML
├── vite.config.js          # Configuración de Vite
├── package.json            # Dependencias y scripts
│
└── src/
    ├── main.jsx            # Montaje de la app en el DOM
    ├── App.jsx             # Rutas principales
    ├── index.css           # Estilos globales y variables CSS
    │
    ├── components/         # Componentes reutilizables de layout
    │   ├── Layout.jsx
    │   ├── Layout.module.css
    │   ├── Header.jsx
    │   ├── Header.module.css
    │   ├── Sidebar.jsx
    │   └── Sidebar.module.css
    │
    ├── pages/              # Pantallas (una por ruta)
    │   ├── Dashboard.jsx
    │   ├── Dashboard.module.css
    │   ├── Shipments.jsx
    │   ├── Shipments.module.css
    │   ├── Tracking.jsx
    │   ├── Tracking.module.css
    │   ├── Documents.jsx
    │   ├── Documents.module.css
    │   ├── Analytics.jsx
    │   ├── Analytics.module.css
    │   ├── Settings.jsx
    │   ├── Settings.module.css
    │   ├── Placeholder.module.css
    │   └── ...
    │
    └── data/
        └── mock.js         # Datos de prueba (KPIs, envíos, documentos)
```

---

## Entrada de la aplicación

### `index.html`

- Página única: define `<div id="root">` y carga el script de entrada.
- Incluye la fuente **DM Sans** (Google Fonts).
- El script de entrada es `/src/main.jsx` (tipo `module`).

### `src/main.jsx`

- Crea la raíz de React con `createRoot(document.getElementById('root'))`.
- Envuelve la app en `<React.StrictMode>` y `<BrowserRouter>`.
- Importa `App.jsx` y los estilos globales `index.css`.
- **Flujo:** `index.html` → `main.jsx` → `App.jsx`.

---

## Enrutado y layout

### `src/App.jsx`

- Define todas las rutas con **React Router** (`Routes` / `Route`).
- La ruta `/` usa el componente **Layout** y rutas anidadas con `<Outlet />`.
- Redirección: `/` → `/dashboard`.
- Rutas definidas:
  - `/dashboard` – Dashboard
  - `/shipments` – Envíos
  - `/tracking` – Seguimiento
  - `/documents` – Documentos
  - `/analytics` – Analíticas
  - `/settings` – Ajustes

### `src/components/Layout.jsx`

- **Layout principal** de la aplicación: sidebar + cabecera + área de contenido.
- Usa `Outlet` de React Router para renderizar la página actual dentro de `styles.content`.
- Estructura:
  - `Sidebar` (navegación lateral).
  - Bloque principal: `Header` + `<main>` con `<Outlet />`.
- Estilos en `Layout.module.css` (flex, overflow del contenido, etc.).

---

## Componentes de layout

### `Sidebar.jsx` + `Sidebar.module.css`

- Menú lateral con enlaces a Dashboard, Shipments, Tracking, Documents, Analytics, Settings.
- Usa **NavLink** de React Router para resaltar la ruta activa.
- Iconos inline (SVG) por sección.
- Estilos: fondo oscuro, texto claro, estado activo/hover.

### `Header.jsx` + `Header.module.css`

- Barra superior con:
  - Campo de búsqueda (placeholder: “Search shipments, tracking numbers…”).
  - Botón de notificaciones.
  - Bloque de cuenta: “Acme Corp”, “Premium Account”, avatar “JD”.
- Estilos en módulo CSS para no chocar con el resto de la app.

---

## Páginas (`src/pages/`)

Cada pantalla sigue el mismo patrón:

- **Un archivo `.jsx`** – componente de la página.
- **Un archivo `.module.css`** – estilos solo para esa página.

| Ruta         | Componente   | Descripción (por nombre)      |
|-------------|--------------|--------------------------------|
| `/dashboard`| `Dashboard`  | Resumen y KPIs                |
| `/shipments`| `Shipments`  | Listado/gestión de envíos     |
| `/tracking` | `Tracking`   | Seguimiento de envíos          |
| `/documents`| `Documents`  | Documentos asociados           |
| `/analytics`| `Analytics`  | Gráficos y analíticas         |
| `/settings` | `Settings`  | Configuración de la app       |

Las páginas se renderizan dentro del `<Outlet />` del **Layout**, por lo que siempre se ven con sidebar y header.

---

## Datos de prueba

### `src/data/mock.js`

- Exporta datos estáticos usados por varias páginas:
  - **kpiCards** – tarjetas del dashboard (Active Shipments, In Transit, etc.).
  - **recentShipments** – envíos recientes.
  - **shipmentByStatus** – conteos por estado (Pending, In Transit, Customs, Delivered).
  - **shipmentsTable** – tabla de envíos (id, client, origin, destination, status, eta).
  - **documentsList** – lista de documentos (título, fecha, tamaño, tipo).

No hay llamadas a API; todo es datos mock para la demo.

---

## Estilos

### `src/index.css`

- **Variables CSS** (`:root`) para colores y tema:
  - Fondos (`--bg`, `--sidebar-bg`, `--card-bg`).
  - Texto (`--text`, `--text-muted`).
  - Estados (`--success`, `--warning`, `--info`, `--pending`).
  - Sidebar (`--sidebar-text`, `--sidebar-active`, `--sidebar-hover`).
- Reset básico (`*`, `body`, `#root`, `a`, `button`).
- Fuente principal: **DM Sans**.

### CSS Modules (`.module.css`)

- Cada componente/página tiene su `.module.css` importado como objeto (p. ej. `styles.card`).
- Los nombres de clase son locales al archivo, lo que evita conflictos entre páginas y componentes.

---

## Configuración del proyecto

### `vite.config.js`

- Usa el plugin **@vitejs/plugin-react** para React.
- Sin alias ni variables de entorno definidas en el fragmento visto.

### `package.json`

- **Scripts:**
  - `npm run dev` – servidor de desarrollo (Vite).
  - `npm run build` – build de producción.
  - `npm run preview` – previsualizar el build.
- **Dependencias:** react, react-dom, react-router-dom.
- **DevDependencies:** Vite, @vitejs/plugin-react, tipos de React.

---

## Flujo de datos y navegación

1. El usuario entra por una URL (p. ej. `/shipments`).
2. **React Router** resuelve la ruta en `App.jsx` y elige la página (p. ej. `Shipments`).
3. **Layout** siempre se renderiza; **Sidebar** y **Header** son fijos.
4. La página correspondiente se pinta en `<Outlet />` dentro del layout.
5. Las páginas importan lo que necesiten de `src/data/mock.js` para mostrar contenido.

No hay estado global (Context/Redux) en la estructura descrita; cada página puede usar `useState` u otros hooks de forma local.

---

## Resumen

| Parte           | Ubicación        | Rol principal                                  |
|----------------|------------------|-----------------------------------------------|
| Entrada HTML   | `index.html`     | Carga la app y el script módulo               |
| Entrada JS     | `src/main.jsx`   | Monta React, Router y estilos globales        |
| Rutas          | `src/App.jsx`    | Define rutas y redirección                    |
| Layout         | `src/components/`| Layout, Sidebar, Header                       |
| Pantallas      | `src/pages/`     | Una página por ruta (JSX + CSS Module)        |
| Datos demo     | `src/data/mock.js` | Datos estáticos para dashboard y listas    |
| Estilos globales | `src/index.css` | Variables y reset                              |
| Estilos por UI | `*.module.css`   | Estilos encapsulados por componente/página    |

Con esta estructura puedes localizar rápidamente dónde se define cada ruta, cada pantalla y de dónde salen los datos de la demo.
