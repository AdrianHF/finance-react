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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
