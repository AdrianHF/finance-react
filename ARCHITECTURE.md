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

### `src/App.jsx` (CONTEO DE LINEAS DE CODIGO: 198)

```jsx
// src/App.jsx
```

### `src/components/AppHeader.jsx` (CONTEO DE LINEAS DE CODIGO: 101)

```jsx
// src/components/AppHeader.jsx
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

### `src/components/Sidebar.jsx` (CONTEO DE LINEAS DE CODIGO: 327)

```jsx
/**
 * @file Sidebar.jsx
 * @component Sidebar
 * @description Navegación lateral de escritorio con soporte para pestañas principales y grupos colapsables.
 *
 * Funcionalidades Clave:
 * - Permite cambiar entre las distintas pestañas principales de la aplicación.
 * - Gestiona la apertura y cierre del grupo colapsable de navegación "Pulgosas".
 * - Gestiona la apertura y cierre del grupo colapsable de navegación "Cubetas".
 * - Delega el control del estado activo al componente padre mediante callbacks.
 *
 * @returns {JSX.Element} Barra de navegación lateral fija para pantallas de escritorio.
 *
 * @public:  Sidebar
 * @imports: react, prop-types, ../styles/styles
 */
```

### `src/components/TransactionsTable.jsx` (CONTEO DE LINEAS DE CODIGO: 236)

```jsx
// src/components/TransactionsTable.jsx
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

### `src/index.css` (CONTEO DE LINEAS DE CODIGO: 12)

```css
/* src/index.css */
```

### `src/styles/styles.js` (CONTEO DE LINEAS DE CODIGO: 367)

```javascript
// src/styles/styles.js
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