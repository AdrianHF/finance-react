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

### `src/App.jsx` (CONTEO DE LINEAS DE CODIGO: 215)

```jsx
/**
 * @file App.jsx
 * @component App
 * @description Componente raíz que orquesta la navegación, filtros globales y vistas principales de la aplicación Dineros.
 *
 * Funcionalidades Clave:
 * - Gestiona el estado global de navegación entre pestañas y submenús.
 * - Administra filtros globales como el mes seleccionado y el modo de visualización histórico.
 * - Integra custom hooks para la carga y procesamiento centralizado de datos financieros.
 * - Proporciona diseño adaptativo (Responsive) alternando entre Sidebar y MobileNav.
 * - Orquesta el renderizado dinámico de tablas, resúmenes y el panel de control (Dashboard).
 *
 * @returns {JSX.Element} Estructura completa de la aplicación contenedora con vistas y navegación activas.
 *
 * @imports: react, ./config/constants, ./utils/dateUtils, ./styles/styles, ./hooks/useIsMobile, ./hooks/useSortConfig, ./hooks/useDashboardData, ./hooks/useTransactionsData, ./components/Sidebar, ./components/MobileNav, ./components/AppHeader, ./components/DashboardTab, ./components/TransactionsTable, ./components/ProjectsSummaryTable, ./components/ProjectTransactionsTable, ./index.css
 */
```

### `src/components/AppHeader.jsx` (CONTEO DE LINEAS DE CODIGO: 250)

```jsx
/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Componente de encabezado adaptable con selector dinámico de fechas y filtros de transacciones.
 *
 * Funcionalidades Clave:
 * - Muestra el título de la pestaña activa de manera responsiva.
 * - Soporta modos de filtrado por mes completo, fecha específica o rango de fechas.
 * - Incluye controles de acción rápida para alternar entre "Todos los pagos" y "Mes actual".
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

### `src/components/ProjectTransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 341)

```jsx
/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra el historial detallado de transacciones de un proyecto con filtros, ordenamiento y métricas financieras resumidas.
 *
 * Funcionalidades Clave:
 * - Renderiza una tabla responsiva con scroll horizontal adaptable para dispositivos móviles.
 * - Calcula y muestra métricas consolidadas de costos, ingresos programados y balance total.
 * - Permite filtrar los movimientos dinámicamente por tipo (todos, costos o ingresos).
 * - Soporta ordenamiento interactivo de columnas mediante callbacks externos.
 * - Formatea importes monetarios con separadores de miles y dos decimales, aplicando colores según el signo.
 *
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 *
 * @public:  ProjectTransactionsTable
 * @imports: react, prop-types, ../styles/styles
 */
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

### `src/hooks/useTransactionsData.js` (CONTEO DE LINEAS DE CODIGO: 474)

```javascript
/**
 * @file useTransactionsData.js
 * @component useTransactionsData
 * @description Hook personalizado para consultar, procesar y calcular métricas financieras de transacciones desde Supabase.
 *
 * Funcionalidades Clave:
 * - Consulta asíncrona de transacciones mensuales e históricas filtradas por persona o proyecto.
 * - Procesamiento y normalización de montos y nombres de buckets y productos.
 * - Cálculo dinámico de métricas de resumen, balances anteriores y saldos acumulados.
 * - Cálculo de intereses mensuales y acumulados para el tab principal.
 * - Generación de resúmenes globales por proyectos y ordenamiento dinámico de datos.
 *
 * @returns {UseTransactionsDataReturn} Objeto con transacciones procesadas, métricas financieras y estado de carga.
 *
 * @public:  useTransactionsData
 * @imports: react, ../supabaseClient, ../config/constants
 */
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

### `src/utils/dateUtils.js` (CONTEO DE LINEAS DE CODIGO: 79)

```javascript
/**
 * @file dateUtils.js
 * @component dateUtils
 * @description Utilidades para la manipulación y formato de fechas en selectores de meses y años.
 *
 * Funcionalidades Clave:
 * - Obtiene el mes actual en formato "YYYY-MM"
 * - Construye un listado estático de años disponibles
 * - Genera nombres de meses en español para interfaces de usuario
 * - Crea opciones dinámicas de meses basadas en un rango histórico
 *
 * @returns {Object} Conjunto de funciones utilitarias para fechas
 *
 * @public:  getCurrentMonthString, buildYearOptions, buildMonthNames, buildMonthOptions
 */
```