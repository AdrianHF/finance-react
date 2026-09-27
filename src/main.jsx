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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
