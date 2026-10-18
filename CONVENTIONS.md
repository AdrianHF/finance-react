1. Stack
- Framework principal: React 19.2.6 con Vite 8.0.12.
- Librerías clave: `@supabase/supabase-js` (2.108.1) para acceso a datos y backend as a service, `prop-types` para validación de props en runtime.
- Estilos: CSS-in-JS mediante objetos de estilos en línea y funciones generadoras centralizadas en `src/styles/styles.js`, acompañados de un archivo global `src/index.css`.

2. Imports
- Relativos vs alias: Se utilizan exclusivamente rutas relativas (`./components/...`, `../utils/...`, `../config/constants`). No hay uso de alias como `@/` o `~/`.
- Subpaths de paquetes: No se utilizan subpaths complejos; se importan los paquetes directamente desde su raíz (`react`, `prop-types`, `@supabase/supabase-js`).

3. Framework-specific
- El acceso a la base de datos se centraliza mediante un cliente singleton importado desde `../supabaseClient` (ej. en `src/hooks/useTransactionsData.js`).
- Las consultas a Supabase utilizan relaciones PostgREST explícitas embebidas en los strings de selección, por ejemplo: `money_buckets!money_bucket(name), payers_loaners!payer_loaner(name), products!product(name)`.
- Tipado y documentación interna fuertemente basados en JSDoc (`@typedef`, `@param`, `@fileoverview`) combinados con validación en runtime mediante `prop-types` en componentes como `AppHeader.jsx`, `DashboardTab.jsx` y `Sidebar.jsx`.

4. Contratos entre componentes
- Naming de props:
  - Los callbacks de cambio o eventos usan el prefijo `on` seguido del evento o nombre de la propiedad (ej. `onSelectTab`, `onSelectedMonthChange`, `onTogglePulgosas`, `onMostrarTodosChange`).
  - Los estados o flags booleanos utilizan prefijos descriptivos como `is` (`isMobile`, `isTransactionTab`) o sustantivos directos (`mostrarTodos`, `pulgosasOpen`, `cubetasOpen`).
- Patrón de callbacks entre padre e hijos: Los componentes hijos (como `Sidebar`, `MobileNav`, `AppHeader`) son estrictamente de presentación ("Dumb Components") y delegan toda mutación o cambio de estado al componente contenedor raíz (`App.jsx`) pasándoles funciones callback vía props.

5. Organización
- Estructura modular basada en responsabilidades:
  - `src/components/`: Componentes de interfaz (tanto de navegación como vistas de pestañas y tablas).
  - `src/hooks/`: Toda la lógica de negocio, efectos secundarios y llamadas a Supabase se abstrae en custom hooks específicos por dominio (ej. `useTransactionsData.js`, `useDashboardData.js`, `useSortConfig.js`, `useIsMobile.js`).
  - `src/config/`: Constantes globales, mapeos de IDs y catálogos en `constants.js`.
  - `src/utils/`: Funciones puras de formateo y manipulación (ej. `dateUtils.js`).
  - `src/styles/`: Definiciones centralizadas de estilos y reglas CSS-in-JS.

6. Anti-patrones
- No mezclar lógica de negocio ni llamadas directas a Supabase dentro de los componentes de presentación (`DashboardTab`, `AppHeader`, etc.); estas deben residir exclusivamente en los custom hooks de `src/hooks/`.
- Evitar el uso de estilos CSS globales arbitrarios o archivos CSS modulares dispersos; los estilos visuales deben agregarse o extenderse a través del módulo centralizado `src/styles/styles.js`.

## Estilo de UI

Tailwind CSS: **NO USADO** en este proyecto.

NO uses clases Tailwind (`flex`, `absolute`, `top-4`, `bg-*`, `p-*`, `m-*`, `text-*`, `gap-*`, etc.) en `className` ni en atributos equivalentes.

Mecanismo detectado: **CSS global** (`import './index.css'` o `./App.css` en el entry point, clases BEM definidas en un único stylesheet).
Ejemplo en el proyecto: `src/App.jsx`.

Para componentes nuevos: NO crees archivos `.css` hermanos y NO importes ningún `.css` desde el componente. Definí las clases nuevas en el CSS global existente (`src/index.css` o `src/App.css`) o reutilizá clases ya definidas. El componente JSX no lleva `import './Foo.css'`.

Evidencia de ausencia de Tailwind: sin `tailwind.config.*`, sin directiva `@tailwind` en CSS, sin `tailwindcss` en `package.json`.