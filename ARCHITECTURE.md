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
├── ARCHITECTURE.md
├── documentacion.md
├── eslint.config.js
├── expand-down-double-svgrepo-com.svg
├── index.html
├── jsdoc.conf.json
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Módulos

### `src/App.jsx`

```jsx
/**
 * @file App.jsx
 * @component App
 * @description Componente raíz que gestiona el estado global, navegación y vistas de la aplicación Dineros.
 *
 * Funcionalidades Clave:
 * - Orquestación de pestañas de navegación para dashboard, transacciones y proyectos
 * - Gestión de filtros globales de fecha y visualización de datos históricos o mensuales
 * - Adaptabilidad de diseño responsivo entre dispositivos móviles y escritorio
 * - Integración con hooks personalizados para el procesamiento de datos y ordenamiento tipo Excel
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con barras de navegación y vistas activas
 */
```

### `src/components/AppHeader.jsx`

```jsx
// src/components/AppHeader.jsx
```

### `src/components/DashboardTab.jsx`

```jsx
// src/components/DashboardTab.jsx
```

### `src/components/MobileNav.jsx`

```jsx
// src/components/MobileNav.jsx
```

### `src/components/ProjectTransactionsTable.jsx`

```jsx
// src/components/ProjectTransactionsTable.jsx
```

### `src/components/ProjectsSummaryTable.jsx`

```jsx
// src/components/ProjectsSummaryTable.jsx
```

### `src/components/Sidebar.jsx`

```jsx
// src/components/Sidebar.jsx
```

### `src/components/TransactionsTable.jsx`

```jsx
// src/components/TransactionsTable.jsx
```

### `src/config/constants.js`

```javascript
// src/config/constants.js
```

### `src/hooks/useDashboardData.js`

```javascript
// src/hooks/useDashboardData.js
```

### `src/hooks/useIsMobile.js`

```javascript
// src/hooks/useIsMobile.js
```

### `src/hooks/useSortConfig.js`

```javascript
// src/hooks/useSortConfig.js
```

### `src/hooks/useTransactionsData.js`

```javascript
// src/hooks/useTransactionsData.js
```

### `src/index.css`

```css
/* src/index.css */
```

### `src/styles/styles.js`

```javascript
/**
 * @file styles.js
 * @component StylesModule
 * @description Modulo centralizado de estilos CSS-in-JS para la aplicacion, incluyendo objetos estaticos y funciones generadoras.
 *
 * Funcionalidades Clave:
 * - Proveedor de estilos de interfaz inspirados en hojas de calculo (tablas, celdas y selectores).
 * - Generadores de estilos dinámicos para estados, botones de navegación y barras de progreso.
 * - Definición de contenedores reutilizables para tarjetas, métricas y dashboards.
 * - Inyección CSS optimizada para resetear elementos nativos de formularios.
 *
 * @returns {Object} Colección de objetos de estilo y funciones generadoras CSS-in-JS.
 */
```

### `src/supabaseClient.js`

```javascript
// src/supabaseClient.js
```

### `src/utils/dateUtils.js`

```javascript
// src/utils/dateUtils.js
//
// Funciones puras relacionadas a fechas. Al ser funciones puras (mismo
// input -> mismo output, sin tocar estado de React) se pueden probar
// de forma aislada y reutilizar en cualquier parte de la app.
```