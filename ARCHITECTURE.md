# Documentación del proyecto

## Árbol del proyecto
```
FINANCE-REACT
├── public
│   ├── ascSort.svg
│   ├── cochinito.svg
│   ├── defaultSort.svg
│   ├── descSort.svg
│   ├── favicon.svg
│   ├── icons.svg
│   ├── magnifier.svg
│   └── money-svgrepo-com.svg
├── src
│   ├── components
│   │   ├── AppHeader.jsx
│   │   ├── DashboardMonthlyChart.jsx
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
│   │   ├── useSortConfig.jsx
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
 * @description Componente raíz que gestiona el estado global de navegación, filtros y vistas adaptativas de la aplicación.
 *
 * Funcionalidades Clave:
 * - Orquestación de pestañas activas (Dashboard, personas y proyectos)
 * - Gestión de filtros globales de fecha y modo de visualización histórico
 * - Adaptación de diseño responsivo entre dispositivos móviles y escritorios
 * - Integración de hooks personalizados para la carga de datos financieros
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con navegación, cabecera y vistas dinámicas.
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

### `src/components/DashboardMonthlyChart.jsx` (CONTEO DE LINEAS DE CODIGO: 412)

```jsx
/**
 * @file DashboardMonthlyChart.jsx
 * @component DashboardMonthlyChart
 * @description Gráfico de líneas interactivo en SVG para visualizar el total mensual a pagar en el panel de control.
 *
 * Funcionalidades Clave:
 * - Parseo robusto y seguro de montos monetarios desde diversos formatos de backend.
 * - Ordenamiento cronológico inteligente de datos históricos (ISO, nombres de meses ES/EN).
 * - Renderizado SVG responsivo con ejes, rejilla dinámica y área de ploteo adaptativa.
 * - Tooltip interactivo y líneas guías (crosshair) al pasar el cursor sobre los puntos.
 * - Agregación defensiva de múltiples filas por mes y soporte para diseño móvil.
 *
 * @returns {JSX.Element} Componente renderizado del gráfico mensual.
 *
 * @public:  DashboardMonthlyChart
 * @imports: react, prop-types, ../styles/styles
 */
```

### `src/components/DashboardTab.jsx` (CONTEO DE LINEAS DE CODIGO: 271)

```jsx
/**
 * @file DashboardTab.jsx
 * @component DashboardTab
 * @description Muestra el resumen financiero mensual, métricas clave y una tabla interactiva de productos y pagos.
 *
 * Funcionalidades Clave:
 * - Renderiza un gráfico histórico y tarjetas con métricas de pagos (Pagado, Por Pagar, Total Mensual).
 * - Incluye una calculadora interactiva en tiempo real para determinar el saldo faltante contra el monto disponible.
 * - Muestra una tabla detallada con los estados de cuenta y opción de ordenamiento por columnas.
 * - Adapta su diseño y distribución de forma responsiva para dispositivos móviles y de escritorio.
 *
 * @returns {JSX.Element} Vista del Dashboard del usuario con métricas y tabla de pagos.
 *
 * @public:  DashboardTab
 * @imports: react, ./DashboardMonthlyChart, prop-types, ../styles/styles
 */
```

### `src/components/MobileNav.jsx` (CONTEO DE LINEAS DE CODIGO: 63)

```jsx
// src/components/MobileNav.jsx
```

### `src/components/ProjectTransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 556)

```jsx
/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra el historial detallado de movimientos, costos e ingresos de un proyecto con filtros y métricas consolidadas.
 *
 * Funcionalidades Clave:
 * - Visualización de transacciones financieras con soporte para filtros de búsqueda por columna y ordenamiento.
 * - Resumen agrupado por pagador mostrando pagos, cobros y diferencia neta.
 * - Cálculo dinámico de costos totales, ingresos programados y balance general.
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

### `src/components/TransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 366)

```jsx
/**
 * @file TransactionsTable.jsx
 * @component TransactionsTable
 * @description Tabla interactiva de transacciones financieras con métricas de resumen y filtros por columna.
 *
 * Funcionalidades Clave:
 * - Visualización de métricas mensuales (pagado, por pagar, adeudos y acumulados anteriores).
 * - Soporte para sección exclusiva de intereses en la pestaña 'padre'.
 * - Filtrado dinámico en tiempo real por cada columna de la tabla.
 * - Ordenamiento interactivo de columnas mediante callbacks personalizados.
 * - Diseño adaptable (responsive) para dispositivos móviles y de escritorio.
 *
 * @returns {JSX.Element} Elemento JSX que renderiza la tabla de transacciones y su cabecera de métricas.
 *
 * @public:  TransactionsTable
 * @imports: react, ../styles/styles
 */
```

### `src/config/constants.js` (CONTEO DE LINEAS DE CODIGO: 103)

```javascript
// src/config/constants.js
```

### `src/hooks/useDashboardData.js` (CONTEO DE LINEAS DE CODIGO: 250)

```javascript
/**
 * @file useDashboardData.js
 * @component useDashboardData
 * @description Custom Hook que gestiona la obtención, cálculo de métricas y ordenamiento de datos financieros del dashboard desde Supabase.
 *
 * Funcionalidades Clave:
 * - Consulta productos y estados de cuenta desde Supabase según el mes y tab activo.
 * - Calcula métricas financieras consolidadas (pagado, por pagar, total general).
 * - Procesa y genera datos históricos de los últimos 12 meses para gráficas.
 * - Aplica ordenamiento dinámico a los productos según criterios configurables.
 *
 * @returns {UseDashboardDataReturn} Objeto que contiene los datos ordenados, métricas financieras, histórico y estado de carga.
 *
 * @public:  useDashboardData
 * @imports: react, ../supabaseClient
 */
```

### `src/hooks/useIsMobile.js` (CONTEO DE LINEAS DE CODIGO: 27)

```javascript
// src/hooks/useIsMobile.js
```

### `src/hooks/useSortConfig.jsx` (CONTEO DE LINEAS DE CODIGO: 50)

```jsx
/**
 * @file useSortConfig.jsx
 * @component useSortConfig
 * @description Hook personalizado para gestionar el estado y la lógica de ordenamiento de tablas o listas.
 *
 * Funcionalidades Clave:
 * - Alterna dinámicamente la dirección de ordenamiento entre ascendente, descendente y sin orden.
 * - Mantiene el estado actual de la configuración de ordenamiento.
 * - Genera el icono visual correspondiente según el estado de ordenamiento de cada columna.
 *
 * @returns {Object} Objeto con la configuración actual, la función para solicitar ordenamiento y el generador de iconos.
 *
 * @public:  useSortConfig
 * @imports: react
 */
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