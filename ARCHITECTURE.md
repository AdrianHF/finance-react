# Documentación del proyecto

## Árbol del proyecto
```
FINANCE-REACT
├── public
│   ├── cochinito.svg
│   ├── favicon.svg
│   ├── icons.svg
│   └── money-svgrepo-com.svg
├── src
│   ├── components
│   │   ├── AppHeader.jsx
│   │   ├── DashboardTab.jsx
│   │   ├── MobileNav.jsx
│   │   ├── ProjectsSummaryTable.jsx
│   │   ├── ProjectTransactionsTable.jsx
│   │   ├── Sidebar.jsx
│   │   └── TransactionsTable.jsx
│   ├── config
│   │   └── constants.js
│   ├── hooks
│   │   ├── useDashboardData.js
│   │   ├── useIsMobile.js
│   │   ├── useSortConfig.js
│   │   └── useTransactionsData.js
│   ├── styles
│   │   └── styles.js
│   ├── utils
│   │   └── dateUtils.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── supabaseClient.js
├── CONVENTIONS.md
├── eslint.config.js
├── expand-down-double-svgrepo-com.svg
├── index.html
├── jsdoc.conf.json
├── package.json
└── vite.config.js
```

## Módulos

### `src/App.jsx` (CONTEO DE LINEAS DE CODIGO: 213)

```jsx
/**
 * @file App.jsx
 * @component App
 * @description Componente raíz que gestiona el estado global de navegación, filtros y sincronización de hooks para la aplicación Dineros.
 *
 * Funcionalidades Clave:
 * - Orquestación de pestañas activas y diseño adaptativo (Mobile/Desktop)
 * - Gestión de filtros temporales por mes y visualización histórica
 * - Integración de datos para el dashboard, transacciones y proyectos
 * - Configuración dinámica de ordenamiento tipo Excel para tablas
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con navegación y vistas activas
 *
 * @imports: react, ./config/constants, ./utils/dateUtils, ./styles/styles, ./hooks/useIsMobile, ./hooks/useSortConfig, ./hooks/useDashboardData, ./hooks/useTransactionsData, ./components/Sidebar, ./components/MobileNav, ./components/AppHeader, ./components/DashboardTab, ./components/TransactionsTable, ./components/ProjectsSummaryTable, ./components/ProjectTransactionsTable, ./index.css
 */
```

### `src/components/AppHeader.jsx` (CONTEO DE LINEAS DE CODIGO: 133)

```jsx
/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Componente de encabezado adaptable que muestra el título de la vista y controles de filtrado temporal.
 *
 * Funcionalidades Clave:
 * - Renderiza dinámicamente el título según la pestaña activa
 * - Incluye un selector desplegable de meses
 * - Proporciona controles de filtrado rápido para transacciones (Todos / Mes actual)
 * - Adapta su diseño responsivo para dispositivos móviles
 *
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior de la aplicación.
 *
 * @public:  AppHeader
 * @imports: react, prop-types, ../config/constants, ../utils/dateUtils, ../styles/styles
 */
```

### `src/components/DashboardTab.jsx` (CONTEO DE LINEAS DE CODIGO: 230)

```jsx
// src/components/DashboardTab.jsx
```

### `src/components/MobileNav.jsx` (CONTEO DE LINEAS DE CODIGO: 63)

```jsx
// src/components/MobileNav.jsx
```

### `src/components/ProjectTransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 289)

```jsx
// src/components/ProjectTransactionsTable.jsx
```

### `src/components/ProjectsSummaryTable.jsx` (CONTEO DE LINEAS DE CODIGO: 162)

```jsx
// src/components/ProjectsSummaryTable.jsx
```

### `src/components/Sidebar.jsx` (CONTEO DE LINEAS DE CODIGO: 336)

```jsx
/**
 * @file Sidebar.jsx
 * @component Sidebar
 * @description Navegación lateral para pantallas de escritorio con pestañas y grupos colapsables.
 *
 * Funcionalidades Clave:
 * - Permite cambiar entre las distintas pestañas principales de la aplicación.
 * - Gestiona grupos de navegación colapsables para "Pulgosas" y "Cubetas".
 * - Delega el manejo del estado activo al componente padre mediante callbacks.
 *
 * @returns {JSX.Element} Barra de navegación lateral fija para escritorio.
 *
 * @public:  Sidebar
 * @imports: react, prop-types, ../styles/styles
 */
```

### `src/components/TransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 253)

```jsx
/**
 * @file TransactionsTable.jsx
 * @component TransactionsTable
 * @description Tabla principal de movimientos con resumen dinámico de métricas financieras y soporte para ordenamiento y dispositivos móviles.
 *
 * Funcionalidades Clave:
 * - Muestra un listado detallado de transacciones con fechas, descripciones, cubetas y montos con formato monetario.
 * - Incluye cabecera de métricas financieras con adeudos, acumulados, pagos del mes y totales a pagar.
 * - Soporta visualización exclusiva de intereses para la pestaña de tipo 'padre'.
 * - Permite ordenar dinámicamente la tabla haciendo clic en las columnas con indicadores visuales.
 * - Se adapta de manera responsiva a pantallas móviles ajustando la disposición de tarjetas y el desplazamiento horizontal.
 *
 * @returns {JSX.Element} Elemento JSX que renderiza la tabla de transacciones y su resumen de métricas.
 *
 * @public:  TransactionsTable
 * @imports: react, ../styles/styles
 */
```

### `src/config/constants.js` (CONTEO DE LINEAS DE CODIGO: 103)

```javascript
// src/config/constants.js
```

### `src/hooks/useDashboardData.js` (CONTEO DE LINEAS DE CODIGO: 145)

```javascript
// src/hooks/useDashboardData.js
```

### `src/hooks/useIsMobile.js` (CONTEO DE LINEAS DE CODIGO: 27)

```javascript
// src/hooks/useIsMobile.js
```

### `src/hooks/useSortConfig.js` (CONTEO DE LINEAS DE CODIGO: 59)

```javascript
// src/hooks/useSortConfig.js
```

### `src/hooks/useTransactionsData.js` (CONTEO DE LINEAS DE CODIGO: 424)

```javascript
// src/hooks/useTransactionsData.js
```

### `src/index.css` (CONTEO DE LINEAS DE CODIGO: 15)

```css
/* src/index.css */
```

### `src/styles/styles.js` (CONTEO DE LINEAS DE CODIGO: 382)

```javascript
/**
 * @file styles.js
 * @component StylesModule
 * @description Módulo de estilos centralizados en CSS-in-JS que proporciona objetos y funciones generadoras de estilos para toda la aplicación.
 *
 * Funcionalidades Clave:
 * - Proveer estilos estáticos y reutilizables para tablas, tarjetas, inputs y contenedores.
 * - Generar estilos dinámicos para badges de estado, botones de navegación y barras de progreso.
 * - Incluir inyecciones de CSS global para normalización de elementos de formulario.
 * - Asegurar la consistencia visual y de diseño en componentes de interfaz.
 *
 * @returns {Object} Colección de objetos de estilo y funciones generadoras de CSS-in-JS.
 *
 * @public:  getStatusBadgeStyle, tabButtonStyle, tabButtonStyleBuckets, mobileTabButtonStyle, textButtonStyle, excelDropdownStyle, excelCardStyle, excelThStyle, excelTdStyle, excelTrStyle, bucketLabelStyle, metricsHeaderContainer, sectionTitleStyle, placeholderCardStyle, tableCardStyle, thStyle, tdStyle, trHoverStyle, emptyDashStyle, infoIconStyle, progressBarTrackStyle, progressBarFillStyle, numberInputResetCSS
 */
```

### `src/supabaseClient.js` (CONTEO DE LINEAS DE CODIGO: 8)

```javascript
// src/supabaseClient.js
```

### `src/utils/dateUtils.js` (CONTEO DE LINEAS DE CODIGO: 48)

```javascript
// src/utils/dateUtils.js
//
// Funciones puras relacionadas a fechas. Al ser funciones puras (mismo
// input -> mismo output, sin tocar estado de React) se pueden probar
// de forma aislada y reutilizar en cualquier parte de la app.
```