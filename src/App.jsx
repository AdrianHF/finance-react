// src/App.jsx
/**
 * @fileoverview Componente raíz de la aplicación "Dineros".
 * Gestiona el estado global de navegación, filtros de fecha/modo de visualización,
 * sincronización de custom hooks con vistas de presentación y diseño adaptativo (Mobile/Desktop).
 */

import React, { useState, useMemo } from 'react';

import { 
  TRANSACTION_TABS, 
  PROJECT_TABS, 
  DEFAULT_SORT_DASHBOARD, 
  DEFAULT_SORT_TRANSACTIONS 
} from './config/constants';
import { getCurrentMonthString, buildMonthOptions } from './utils/dateUtils';
import { placeholderCardStyle } from './styles/styles';

import { useIsMobile } from './hooks/useIsMobile';
import { useSortConfig } from './hooks/useSortConfig';
import { useDashboardData } from './hooks/useDashboardData';
import { useTransactionsData } from './hooks/useTransactionsData';

import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import AppHeader from './components/AppHeader';
import DashboardTab from './components/DashboardTab';
import TransactionsTable from './components/TransactionsTable';
import ProjectsSummaryTable from './components/ProjectsSummaryTable';
import ProjectTransactionsTable from './components/ProjectTransactionsTable';

import './index.css';

/**
 * Componente principal `App`.
 * Actúa como orquestador y contenedor principal de la aplicación.
 *
 * @component
 * @returns {JSX.Element} Estructura completa de la aplicación con Sidebar/MobileNav, AppHeader y vistas activas.
 */
function App() {
  // --- Estado de navegación ---
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} Tab o vista activa actual */
  const [activeTab, setActiveTab] = useState('dashboard');

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} Control de apertura del submenú de usuarios ("Pulgosas") */
  const [pulgosasOpen, setPulgosasOpen] = useState(false);

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} Control de apertura del submenú de proyectos ("Cubetas") */
  const [cubetasOpen, setCubetasOpen] = useState(false);

  /** @type {boolean} Flag que determina si la pantalla es de tamaño móvil (<= 768px) */
  const isMobile = useIsMobile(768);

  // --- Estado de filtros compartidos entre tabs ---
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} Mes seleccionado en formato "YYYY-MM" */
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} Modode vista: true para histórico completo, false para mes activo */
  const [mostrarTodos, setMostrarTodos] = useState(false);

  /** @type {[string|number, React.Dispatch<React.SetStateAction<string|number>>]} Presupuesto o monto libre ingresado en el Dashboard */
  const [montoDisponible, setMontoDisponible] = useState('');

  // --- Ordenamiento tipo Excel ---
  const { sortConfig, setSortConfig, requestSort, getSortIcon } = useSortConfig(DEFAULT_SORT_DASHBOARD);

  /** @type {boolean} Banderas que determinan el tipo de tab actual */
  const isTransactionTab = TRANSACTION_TABS.includes(activeTab);
  const isProjectTab = PROJECT_TABS.includes(activeTab);

  /** 
   * Opciónes precalculadas de meses para el selector del encabezado.
   * @type {Array<{value: string, label: string}>} 
   */
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  // --- Consulta y procesamiento de datos por tab ---
  const dashboard = useDashboardData(activeTab, selectedMonth, sortConfig);
  const transactions = useTransactionsData(
    activeTab, 
    selectedMonth, 
    isTransactionTab || isProjectTab, 
    mostrarTodos, 
    sortConfig
  );

  /** @type {boolean} Estado de carga global unificado segun la vista activa */
  const loading = activeTab === 'dashboard' ? dashboard.loading : transactions.loading;

  /**
   * Cambia la pestaña activa y restablece el criterio de ordenamiento por defecto correspondiente.
   *
   * @param {string} tabId - Identificador único de la pestaña a activar.
   */
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSortConfig(tabId === 'dashboard' ? DEFAULT_SORT_DASHBOARD : DEFAULT_SORT_TRANSACTIONS);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        paddingBottom: isMobile ? '70px' : '0px',
      }}
    >
      {!isMobile ? (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          pulgosasOpen={pulgosasOpen}
          cubetasOpen={cubetasOpen}
          onTogglePulgosas={() => setPulgosasOpen(!pulgosasOpen)}
          onToggleCubetas={() => setCubetasOpen(!cubetasOpen)}
        />
      ) : (
        <MobileNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      )}

      <main style={{ flex: 1, padding: isMobile ? '16px' : '40px', width: '100%', boxSizing: 'border-box' }}>
        <AppHeader
          activeTab={activeTab}
          isMobile={isMobile}
          selectedMonth={selectedMonth}
          onSelectedMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
          isTransactionTab={isTransactionTab || isProjectTab}
          mostrarTodos={mostrarTodos}
          onMostrarTodosChange={setMostrarTodos}
        />

        <section>
          {loading ? (
            <div style={placeholderCardStyle}>
              <h3>Cargando datos...</h3>
            </div>
          ) : (
            <>
              {/* 1. VISTA DASHBOARD */}
              {activeTab === 'dashboard' && (
                <DashboardTab
                  isMobile={isMobile}
                  sortedData={dashboard.sortedData}
                  metricasFinancieras={dashboard.metricasFinancieras}
                  montoDisponible={montoDisponible}
                  onMontoDisponibleChange={setMontoDisponible}
                  requestSort={requestSort}
                  getSortIcon={getSortIcon}
                />
              )}

              {/* 2. VISTAS DE PERSONAS (Marie, Ana, Padre, Jefesita) */}
              {isTransactionTab && (
                <>
                  <TransactionsTable
                    activeTab={activeTab}
                    isMobile={isMobile}
                    mostrarTodos={mostrarTodos}
                    sortedData={transactions.sortedData}
                    metricasResumen={transactions.metricasResumen}
                    adeudoAnterior={transactions.adeudoAnterior}
                    acumuladoAnterior={transactions.acumuladoAnterior}
                    mostrarAdeudoAnterior={transactions.mostrarAdeudoAnterior}
                    mostrarAcumuladoAnterior={transactions.mostrarAcumuladoAnterior}
                    interesMesAnterior={transactions.interesMesAnterior}
                    interesesAcumulados={transactions.interesesAcumulados}
                    requestSort={requestSort}
                    getSortIcon={getSortIcon}
                  />
                  <ProjectsSummaryTable isMobile={isMobile} resumenBuckets={transactions.resumenBuckets} />
                </>
              )}

              {/* 3. VISTAS DE PROYECTOS / CUBETAS (Terreno Felipao, etc.) */}
              {isProjectTab && (
                <ProjectTransactionsTable
                  isMobile={isMobile}
                  mostrarTodos={mostrarTodos}
                  sortedData={transactions.sortedData}
                  totalMensual={transactions.metricasResumen?.totalMensual || 0}
                  adeudoAnterior={transactions.adeudoAnterior}
                  requestSort={requestSort}
                  getSortIcon={getSortIcon}
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;