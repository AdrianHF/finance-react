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
├── eslint.config.js
├── expand-down-double-svgrepo-com.svg
├── index.html
├── jsdoc.conf.json
├── package.json
└── vite.config.js
```

## Módulos

### `eslint.config.js`

```javascript
/**
 * @file eslint.config.js
 * @component Config
 * @description Configuración principal de ESLint para el proyecto basada en el formato plano.
 *
 * Funcionalidades Clave:
 * - Ignora el directorio de distribución (dist) globalmente.
 * - Aplica reglas recomendadas de JavaScript y React Hooks.
 * - Integra soporte para React Refresh en entornos Vite.
 * - Configura variables globales del navegador y soporte para JSX.
 *
 * @returns {import('eslint').Linter.Config[]} La configuración plana de ESLint.
 */
```

### `src/App.jsx`

```jsx
/**
 * @file App.jsx
 * @component App
 * @description Componente raíz que gestiona el estado global, la navegación y las vistas de la aplicación Dineros.
 *
 * Funcionalidades Clave:
 * - Orquestación de navegación y pestañas activas (Dashboard, transacciones y proyectos)
 * - Gestión de filtros globales de fecha y modo de visualización histórico
 * - Diseño adaptativo con soporte para dispositivos móviles y escritorio
 * - Integración de hooks personalizados para datos financieros y ordenamiento tipo Excel
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con barras de navegación y vistas activas
 */
```

### `src/components/AppHeader.jsx`

```jsx
/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Renderiza el encabezado principal adaptativo con título de vista, selector de mes y controles de filtrado.
 *
 * Funcionalidades Clave:
 * - Adapta su diseño de forma responsiva entre dispositivos móviles y escritorio.
 * - Muestra el título correspondiente a la pestaña activa de la aplicación.
 * - Proporciona un selector dinámico para filtrar datos por mes.
 * - Incluye controles de acción rápida para alternar entre "Todos los pagos" y "Mes actual".
 *
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior de la aplicación.
 */
```

### `src/components/DashboardTab.jsx`

```jsx
/**
 * @file DashboardTab.jsx
 * @component DashboardTab
 * @description Muestra el resumen financiero mensual, una calculadora interactiva de saldo faltante y una tabla detallada de pagos.
 *
 * Funcionalidades Clave:
 * - Visualización de métricas generales (Total Pagado, Por Pagar y Total Mensual).
 * - Calculadora en tiempo real para determinar el saldo faltante según el monto disponible ingresado.
 * - Tabla interactiva con soporte para ordenamiento por columnas.
 * - Adaptabilidad de diseño responsivo (modo móvil y escritorio).
 * - Renderizado dinámico de estados de cuenta y insignias de estatus.
 *
 * @returns {JSX.Element} Vista del Dashboard financiero del mes.
 */
```

### `src/components/MobileNav.jsx`

```jsx
/**
 * @file MobileNav.jsx
 * @component MobileNav
 * @description Barra de navegación inferior fija optimizada para dispositivos móviles.
 *
 * Funcionalidades Clave:
 * - Posicionamiento fijo en la parte inferior del viewport con sombra y diseño adaptativo.
 * - Renderizado dinámico de pestañas basado en una configuración centralizada (MOBILE_TABS).
 * - Manejo de estados activos para resaltar la pestaña seleccionada actualmente.
 * - Ejecución de callbacks para notificar al componente padre sobre el cambio de pestaña.
 *
 * @returns {JSX.Element} Elemento de navegación inferior con botones interactivos.
 */
```

### `src/components/ProjectTransactionsTable.jsx`

```jsx
/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra el historial de transacciones y movimientos de un proyecto con métricas financieras dinámicas.
 *
 * Funcionalidades Clave:
 * - Calcula y muestra el monto total pagado en el mes actual a partir de abonos positivos.
 * - Calcula el saldo restante por pagar del periodo actual y la deuda total consolidada.
 * - Renderiza una tabla responsiva con soporte para scroll horizontal en dispositivos móviles.
 * - Permite ordenar los registros por columnas de forma interactiva mediante callbacks.
 * - Formatea importes monetarios y colorea los montos según su signo (positivo/negativo).
 *
 * @returns {JSX.Element} Componente de tabla con movimientos y resumen financiero del proyecto.
 */
```

### `src/components/ProjectsSummaryTable.jsx`

```jsx
/**
 * @file ProjectsSummaryTable.jsx
 * @component ProjectsSummaryTable
 * @description Renderiza una tabla resumen de proyectos con barras de progreso, desglose de cuotas y liquidación global de deudas.
 *
 * Funcionalidades Clave:
 * - Muestra el avance detallado de cuotas y montos cobrados por cada proyecto registrado
 * - Incluye una barra de progreso visual interactiva basada en el porcentaje completado
 * - Presenta totales consolidados de deuda, dinero recibido y saldo pendiente en el pie de página
 *
 * @returns {JSX.Element} Tabla responsiva con estilo de hoja de cálculo y métricas financieras
 */
```

### `src/components/Sidebar.jsx`

```jsx
/**
 * @file Sidebar.jsx
 * @component Sidebar
 * @description Navegación lateral para pantallas de escritorio con pestañas y grupos colapsables.
 *
 * Funcionalidades Clave:
 * - Permite cambiar entre las distintas pestañas principales de la aplicación
 * - Proporciona un grupo desplegable colapsable para las secciones de "Pulgosas"
 * - Proporciona un grupo desplegable colapsable para las secciones de "Cubetas"
 * - Delega la gestión del estado de la pestaña activa al componente padre
 *
 * @returns {JSX.Element} Barra de navegación lateral fija para escritorio
 */
```

### `src/components/TransactionsTable.jsx`

```jsx
/**
 * @file TransactionsTable.jsx
 * @component TransactionsTable
 * @description Tabla principal de movimientos financieros con resumen de métricas y soporte responsivo.
 *
 * Funcionalidades Clave:
 * - Muestra un listado detallado de transacciones ordenables por columna
 * - Presenta métricas resumidas del mes (pagos, adeudos y totales a liquidar)
 * - Soporta bloques condicionales exclusivos para la pestaña padre (intereses)
 * - Se adapta dinámicamente a vistas móviles y de escritorio
 *
 * @returns {JSX.Element} Elemento JSX de la tabla de transacciones con su resumen de métricas.
 */
```

### `src/config/constants.js`

```javascript
/**
 * @file constants.js
 * @component Constants
 * @description Centraliza las constantes, mapas y configuraciones globales de la aplicación.
 *
 * Funcionalidades Clave:
 * - Define los nombres visibles y tipos de pestañas disponibles en la interfaz.
 * - Mapea las pestañas con sus respectivos IDs de pagadores y prestamistas en la base de datos.
 * - Establece la relación con los Money Buckets personales y de proyectos.
 * - Clasifica las pestañas según su naturaleza (proyectos o transacciones).
 * - Configura los parámetros de ordenamiento por defecto para las tablas.
 *
 * @returns {Object} Colección de constantes y mapas de configuración global.
 */
```

### `src/hooks/useDashboardData.js`

```javascript
/**
 * @file useDashboardData.js
 * @component useDashboardData
 * @description Hook personalizado que gestiona la obtención, filtrado y cálculo de métricas financieras para el dashboard.
 *
 * Funcionalidades Clave:
 * - Consulta productos y estados de cuenta desde Supabase según el mes y la pestaña activa.
 * - Calcula automáticamente las métricas financieras (pagado, por pagar, total general).
 * - Aplica ordenamiento dinámico a los datos de la tabla según múltiples criterios.
 * - Gestiona el estado de carga durante las peticiones asíncronas.
 *
 * @returns {UseDashboardDataReturn} Objeto que contiene los datos ordenados, métricas financieras y estado de carga.
 */
```

### `src/hooks/useIsMobile.js`

```javascript
/**
 * @file useIsMobile.js
 * @component useIsMobile
 * @description Hook personalizado que detecta si el ancho de la ventana es menor o igual a un breakpoint especificado.
 *
 * Funcionalidades Clave:
 * - Evalúa el ancho del viewport en tiempo real mediante eventos de resize.
 * - Permite configurar un punto de quiebre (breakpoint) personalizado.
 * - Limpia los event listeners al desmontar el componente para evitar fugas de memoria.
 * - Retorna un valor booleano indicando si la vista actual es móvil.
 *
 * @returns {boolean} `true` si el ancho actual es menor o igual al breakpoint, de lo contrario `false`.
 */
```

### `src/hooks/useSortConfig.js`

```javascript
/**
 * @file useSortConfig.js
 * @component useSortConfig
 * @description Custom hook que centraliza la lógica de ordenamiento para tablas con alternancia de dirección e íconos.
 *
 * Funcionalidades Clave:
 * - Gestiona el estado de la columna activa y la dirección del ordenamiento.
 * - Alterna automáticamente entre orden ascendente y descendente al hacer clic en una columna.
 * - Proporciona una función para actualizar manualmente la configuración de ordenamiento.
 * - Genera indicadores visuales (flechas) según el estado actual de cada columna.
 *
 * @returns {UseSortConfigReturn} Objeto con el estado del ordenamiento y las funciones auxiliares para manipularlo.
 */
```

### `src/hooks/useTransactionsData.js`

```javascript
/**
 * @file useTransactionsData.js
 * @component useTransactionsData
 * @description Hook universal para gestionar datos de transacciones financieras desde Supabase, permitiendo filtrado por mes y cálculo de métricas.
 *
 * Funcionalidades Clave:
 * - Consulta el histórico completo de transacciones desde Supabase según la pestaña activa (persona o proyecto).
 * - Filtra y procesa los datos en memoria para el mes seleccionado o de manera global.
 * - Calcula métricas de resumen, balance histórico, intereses acumulados y resumen por buckets/proyectos.
 * - Proporciona ordenamiento de datos configurable al estilo tabla Excel.
 *
 * @returns {Object} Objeto con datos ordenados, métricas financieras, estados de carga y resúmenes históricos.
 */
```

### `src/index.css`

```css
<!--
@file index.css
@description Hoja de estilos global para la aplicación con reseteo CSS y configuración base.

Funcionalidades Clave:
- Reseteo universal de márgenes, paddings y box-sizing
- Definición de la fuente tipográfica predeterminada (Segoe UI y alternativas)
- Configuración del color de fondo general para la interfaz
- Establecimiento del color de texto principal oscuro para legibilidad
-->
```

### `src/main.jsx`

```jsx
/**
 * @file main.jsx
 * @component Main
 * @description Punto de entrada principal de la aplicación React que monta el componente raíz en el DOM.
 *
 * Funcionalidades Clave:
 * - Importa los estilos globales de la aplicación
 * - Renderiza el componente App dentro de StrictMode
 * - Selecciona el elemento raíz del DOM con ID 'root'
 * - Inicializa el cliente de renderizado de React
 *
 * @returns {void} No retorna ningún valor
 */
```

### `src/styles/styles.js`

```javascript
/**
 * @file styles.js
 * @component StylesModule
 * @description Módulo de estilos centralizados basado en CSS-in-JS para la interfaz de usuario.
 *
 * Funcionalidades Clave:
 * - Define una paleta de colores corporativa y tokens de diseño reutilizables.
 * - Proporciona generadores de estilos dinámicos para estados, botones y barras de progreso.
 * - Incluye conjuntos de estilos estáticos para tablas, tarjetas y elementos tipográficos.
 * - Centraliza reglas CSS globales y utilidades visuales para mantener la consistencia visual.
 *
 * @returns {Object} Colección de objetos de estilo y funciones generadoras de CSS-in-JS.
 */
```

### `src/supabaseClient.js`

```javascript
/**
 * @file supabaseClient.js
 * @component supabaseClient
 * @description Inicializa y exporta la instancia del cliente de Supabase para la aplicación.
 *
 * Funcionalidades Clave:
 * - Importa la función createClient desde la librería oficial de Supabase.
 * - Configura la URL del proyecto y la llave anónima pública.
 * - Exporta el cliente de Supabase configurado para su uso en otros módulos.
 *
 * @returns {Object} Instancia del cliente de Supabase configurada.
 */
```

### `src/utils/dateUtils.js`

```javascript
/**
 * @file dateUtils.js
 * @component dateUtils
 * @description Utilidades para la gestión, formato y generación de opciones de meses en la aplicación.
 *
 * Funcionalidades Clave:
 * - Obtiene el mes actual en formato "YYYY-MM" para valores por defecto.
 * - Construye un listado de opciones de meses para elementos selectores.
 * - Formatea los nombres de los meses en español y en mayúsculas.
 * - Utiliza una fecha de inicio predefinida para generar un rango histórico de meses.
 *
 * @returns {Object} Conjunto de funciones utilitarias relacionadas con fechas.
 */
```

### `vite.config.js`

```javascript
/**
 * @file vite.config.js
 * @component ViteConfig
 * @description Configuración principal del empaquetador Vite para el proyecto React
 *
 * Funcionalidades Clave:
 * - Define la configuración global utilizando la función defineConfig de Vite
 * - Integra el plugin oficial de React (@vitejs/plugin-react) para soporte JSX y Fast Refresh
 * - Establece la base para la compilación y desarrollo del frontend
 *
 * @returns {import('vite').UserConfig} Objeto de configuración de Vite
 */
```