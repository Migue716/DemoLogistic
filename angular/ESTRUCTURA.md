# Estructura del código - ShipTrack (versión Angular)

Este documento describe la organización del proyecto Angular y el papel de cada parte del código.

---

## Visión general

**ShipTrack (Angular)** es la misma aplicación de seguimiento de envíos que la versión React, construida con:

- **Angular 18** – framework y componentes standalone
- **TypeScript 5.4** – tipado estático
- **Angular Router** – rutas con lazy loading
- **Signals** – estado reactivo en páginas (shipments, documents, settings)
- **Control flow nuevo** – `@if`, `@for`, `@switch` en plantillas
- **CSS global** – variables en `styles.css` (mismo diseño que React)

---

## Árbol de carpetas (código fuente)

```
angular/
├── angular.json           # Configuración del CLI y build
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Opciones de TypeScript (base)
├── tsconfig.app.json      # TypeScript para la aplicación
├── README.md              # Instrucciones rápidas
├── ESTRUCTURA.md          # Este documento
│
└── src/
    ├── index.html         # Punto de entrada HTML
    ├── main.ts            # Bootstrap de la app
    ├── styles.css         # Estilos globales y variables CSS
    ├── assets/            # Recursos estáticos
    │
    └── app/
        ├── app.config.ts      # Proveedores (router, zone)
        ├── app.component.ts   # Componente raíz (solo router-outlet)
        ├── app.routes.ts      # Definición de rutas
        │
        ├── components/       # Componentes de layout
        │   ├── layout/
        │   │   ├── layout.component.ts
        │   │   ├── layout.component.html
        │   │   └── layout.component.css
        │   ├── header/
        │   │   ├── header.component.ts
        │   │   ├── header.component.html
        │   │   └── header.component.css
        │   └── sidebar/
        │       ├── sidebar.component.ts
        │       ├── sidebar.component.html
        │       └── sidebar.component.css
        │
        ├── pages/             # Pantallas (una por ruta)
        │   ├── dashboard/
        │   ├── shipments/
        │   ├── tracking/
        │   ├── documents/
        │   ├── analytics/
        │   └── settings/
        │
        └── data/
            └── mock.service.ts   # Servicio con datos de prueba
```

Cada componente de página tiene sus propios `.ts`, `.html` y `.css`.

---

## Entrada de la aplicación

### `src/index.html`

- Página única: define `<app-root>` y carga la app.
- Incluye la fuente **DM Sans** (Google Fonts), igual que la versión React.

### `src/main.ts`

- Arranca la aplicación con `bootstrapApplication(AppComponent, appConfig)`.
- No usa módulos NgModule; todo es standalone.

### `src/app/app.config.ts`

- **ApplicationConfig**: proveedores globales.
- `provideZoneChangeDetection` – detección de cambios.
- `provideRouter(routes)` – configuración del router.

### `src/app/app.component.ts`

- Selector `app-root`.
- Solo incluye `<router-outlet>`: no tiene layout propio; el layout va en las rutas hijas.

---

## Enrutado

### `src/app/app.routes.ts`

- **Ruta vacía `''`** → redirección a `/dashboard`.
- **Ruta `''` con hijos** → carga `LayoutComponent` y define las rutas hijas:
  - `dashboard` → `DashboardComponent`
  - `shipments` → `ShipmentsComponent`
  - `tracking` → `TrackingComponent`
  - `documents` → `DocumentsComponent`
  - `analytics` → `AnalyticsComponent`
  - `settings` → `SettingsComponent`
- **`**`** → redirección a `/dashboard`.

Todas las rutas hijas usan **lazy loading** (`loadComponent` con `import()` dinámico), de modo que cada página se descarga solo cuando se visita.

---

## Layout

### `src/app/components/layout/`

- **LayoutComponent**: estructura principal (sidebar + header + área de contenido).
- En el HTML: `<app-sidebar>`, bloque principal con `<app-header>` y `<main class="content">` que envuelve `<router-outlet>`.
- El contenido de cada ruta se renderiza dentro de ese `<router-outlet>`.

### `src/app/components/sidebar/`

- Menú lateral con enlaces a Dashboard, Shipments, Tracking, Documents, Analytics, Settings.
- Usa **RouterLink** y **RouterLinkActive** para resaltar la ruta activa.
- Iconos SVG inline por ítem (`@switch` según `item.icon`).
- Estilos: mismo aspecto que la versión React (fondo oscuro, enlace activo en azul).

### `src/app/components/header/`

- Barra superior: búsqueda, botón de notificaciones, bloque de cuenta (Acme Corp, Premium Account), avatar.
- Sin lógica; solo presentación.

---

## Páginas (`src/app/pages/`)

Cada carpeta contiene un componente standalone con su plantilla y estilos.

| Ruta          | Componente        | Contenido principal                              |
|--------------|-------------------|--------------------------------------------------|
| `/dashboard` | DashboardComponent | KPIs, envíos recientes, gráfico por estado       |
| `/shipments` | ShipmentsComponent | Tabla de envíos, búsqueda, filtro, export CSV    |
| `/tracking`  | TrackingComponent  | Placeholder (mapa de seguimiento)                |
| `/documents` | DocumentsComponent | Pestañas (All, Bills, Invoices, Certificates), lista de documentos |
| `/analytics` | AnalyticsComponent | Placeholder (gráficos y reportes)                |
| `/settings`  | SettingsComponent  | Perfil, preferencias, notificaciones, suscripción |

- **Dashboard**: usa `MockService` (inyección), getters para datos y `maxCount`; badges de estado con `NgClass`.
- **Shipments**: **signals** (`search`, `filterOpen`), **computed** (`filtered`), export CSV; tabla con badges.
- **Documents**: **signals** (`activeTab`), **computed** (`filtered`); pestañas y lista de documentos.
- **Settings**: **signals** para `profile`, `prefs`, `notifications`; métodos `updateProfile`, `updatePrefs`, `updateNotifications`.
- **Tracking** y **Analytics**: solo título, subtítulo y bloque placeholder.

---

## Datos de prueba

### `src/app/data/mock.service.ts`

- **Injectable** `providedIn: 'root'` (singleton).
- Expone datos de solo lectura:
  - `kpiCards` – tarjetas del dashboard
  - `recentShipments` – envíos recientes
  - `shipmentByStatus` – conteos por estado
  - `shipmentsTable` – tabla de envíos
  - `documentsList` – lista de documentos
- Incluye interfaces TypeScript: `KpiCard`, `RecentShipment`, `ShipmentByStatus`, `ShipmentRow`, `DocumentItem`.

Las páginas inyectan `MockService` con `inject(MockService)` y usan estas propiedades directamente (sin llamadas HTTP).

---

## Estilos

### `src/styles.css`

- **Variables CSS** (`:root`): mismas que la versión React (`--bg`, `--sidebar-bg`, `--sidebar-active`, `--card-bg`, `--text`, `--success`, `--warning`, etc.).
- Reset básico y estilos de `body` y `app-root`.
- Fuente: **DM Sans**.

Cada componente tiene su archivo `.css` asociado (por ejemplo `dashboard.component.css`); no se usan CSS Modules; los estilos son específicos del componente por encapsulación de Angular.

---

## Configuración del proyecto

### `angular.json`

- Proyecto `shiptrack-angular`.
- **Build**: builder `application`, entrada `src/main.ts`, `index` en `src/index.html`, estilos en `src/styles.css`, assets en `src/assets`.
- **Serve**: dev server con recarga en modo desarrollo.

### `package.json`

- **Scripts**: `ng`, `start` → `ng serve`, `build` → `ng build`, `watch` → `ng build --watch`.
- **Dependencias**: Angular 18 (core, common, router, forms, etc.), rxjs, zone.js, tslib.
- **DevDependencies**: Angular CLI, build-angular, compiler-cli, TypeScript.

---

## Flujo de datos y navegación

1. El usuario entra en una URL (por ejemplo `/shipments`).
2. El **Router** resuelve la ruta en `app.routes.ts` y carga de forma perezosa el componente correspondiente.
3. **LayoutComponent** envuelve todas las rutas hijas; Sidebar y Header son fijos.
4. La página se renderiza en `<router-outlet>` dentro del layout.
5. Las páginas que necesitan datos inyectan `MockService` y usan sus propiedades; las que tienen estado usan **signals** y **computed**.

No hay estado global (NgRx, servicios de estado); el estado es local a cada página (signals) y los datos compartidos vienen de `MockService`.

---

## Resumen

| Parte            | Ubicación              | Rol principal                                      |
|------------------|------------------------|----------------------------------------------------|
| Entrada HTML     | `src/index.html`       | Carga de la app y fuentes                          |
| Bootstrap        | `src/main.ts`          | Inicio de la app con `appConfig`                    |
| Configuración     | `src/app/app.config.ts`| Proveedores (router, zone)                         |
| Rutas            | `src/app/app.routes.ts`| Rutas y lazy loading de páginas                    |
| Layout           | `src/app/components/`  | Layout, Sidebar, Header                            |
| Pantallas        | `src/app/pages/`       | Una página por ruta (standalone, con/sin signals)   |
| Datos mock       | `src/app/data/mock.service.ts` | Servicio inyectable con datos estáticos     |
| Estilos globales | `src/styles.css`       | Variables y reset                                  |

Con esta estructura puedes localizar rápidamente dónde se define cada ruta, cada pantalla y de dónde salen los datos en la versión Angular.
