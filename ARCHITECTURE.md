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
 * @description Componente raíz que gestiona el estado global, la navegación y las vistas principales de la aplicación Dineros.
 *
 * Funcionalidades Clave:
 * - Orquestación de pestañas activas y diseño adaptativo para dispositivos móviles y escritorio.
 * - Gestión de filtros globales de fecha, modo de visualización histórico/mensual y presupuesto.
 * - Integración de hooks personalizados para la consulta y procesamiento de datos financieros.
 * - Renderizado condicional de vistas de dashboard, tablas de transacciones y resúmenes de proyectos.
 *
 * @returns {JSX.Element} Estructura completa de la aplicación con la navegación, encabezado y contenido dinámico.
 */
```

### `src/components/AppHeader.jsx`

```jsx
/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Componente de encabezado principal adaptativo que muestra títulos, selector de mes y controles de filtrado.
 *
 * Funcionalidades Clave:
 * - Renderiza dinámicamente el título según la pestaña activa de la aplicación
 * - Proporciona un selector desplegable para filtrar registros por mes
 * - Incluye controles de acción rápida para alternar entre "Todos los pagos" y "Mes actual"
 * - Adapta su diseño estructural y tipográfico para dispositivos móviles y de escritorio
 *
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior de la aplicación
 */
```

### `src/components/DashboardTab.jsx`

```jsx
/**
 * @file DashboardTab.jsx
 * @component DashboardTab
 * @description Muestra el resumen financiero mensual, calculadora de saldo faltante y tabla detallada de pagos.
 *
 * Funcionalidades Clave:
 * - Visualización de métricas generales (Total Pagado, Por Pagar, Total Mensual).
 * - Calculadora interactiva en tiempo real para determinar el saldo faltante según el monto disponible.
 * - Tabla detallada de productos y estados de cuenta con soporte para ordenamiento por columnas.
 * - Adaptabilidad responsive para dispositivos móviles y escritorio.
 *
 * @returns {JSX.Element} Vista del Dashboard del usuario.
 */
```

### `src/components/MobileNav.jsx`

```jsx
/**
 * @file MobileNav.jsx
 * @component MobileNav
 * @description Barra de navegación inferior fija diseñada exclusivamente para dispositivos móviles.
 *
 * Funcionalidades Clave:
 * - Posicionamiento fijo en la parte inferior del viewport con sombra y elevación (zIndex).
 * - Renderizado dinámico de pestañas a partir de una configuración centralizada (MOBILE_TABS).
 * - Emisión de eventos al componente padre mediante un callback al seleccionar una pestaña.
 * - Sincronización visual del estado activo/inactivo en cada botón de navegación.
 *
 * @returns {JSX.Element} Barra de navegación fija inferior para móviles.
 */
```

### `src/components/ProjectTransactionsTable.jsx`

```jsx
/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra la tabla de transacciones de un proyecto y calcula métricas financieras en tiempo de render.
 *
 * Funcionalidades Clave:
 * - Renderiza el historial detallado de movimientos (abonos y cargos) con soporte responsivo.
 * - Calcula dinámicamente el monto total pagado en el mes mediante abonos positivos.
 * - Calcula el saldo restante por pagar del periodo actual y la deuda total consolidada.
 * - Soporta ordenamiento interactivo de columnas mediante callbacks externos.
 * - Formatea importes monetarios y aplica indicadores visuales según el estado de los saldos.
 *
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 */
```

### `src/components/ProjectsSummaryTable.jsx`

```jsx
/**
 * @file ProjectsSummaryTable.jsx
 * @component ProjectsSummaryTable
 * @description Renderiza una tabla resumen de proyectos con barras de progreso de pagos y totales consolidados.
 *
 * Funcionalidades Clave:
 * - Muestra el avance histórico y de cuotas por cada proyecto mediante barras visuales
 * - Formatea automáticamente los montos monetarios en notación estándar de US
 * - Presenta un pie de tabla detallado con deuda total, dinero recibido y saldo restante
 *
 * @returns {JSX.Element} Tabla de resumen financiero en estilo hoja de cálculo
 */
```

### `src/components/Sidebar.jsx`

```jsx
/**
 * @file Sidebar.jsx
 * @component Sidebar
 * @description Navegación lateral fija para pantallas de escritorio con soporte para pestañas y grupos desplegables.
 *
 * Funcionalidades Clave:
 * - Renderiza la barra de navegación lateral y el logotipo de la aplicación
 * - Permite alternar entre pestañas principales y de usuario de forma dinámica
 * - Gestiona la apertura y cierre de grupos colapsables como Pulgosas y Cubetas
 * - Delega el control del estado activo al componente padre mediante callbacks
 *
 * @returns {JSX.Element} Barra de navegación lateral fija para escritorio.
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
 * @description Modulo centralizado de estilos CSS-in-JS y funciones generadoras de diseño para la aplicación.
 *
 * Funcionalidades Clave:
 * - Proporciona objetos de estilos estáticos para componentes comunes como tarjetas, tablas y botones.
 * - Incluye funciones generadoras para estilos dinámicos basados en estados o porcentajes.
 * - Centraliza esquemas visuales consistentes para elementos como badges, barras de progreso y tipografías.
 * - Define inyecciones de CSS global para utilidades específicas como el reseteo de inputs numéricos.
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