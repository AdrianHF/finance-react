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

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
