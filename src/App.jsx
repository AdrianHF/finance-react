// src/App.jsx
//
// Componente raíz de "Dineros". Después de la modularización, App.jsx
// ya NO sabe cómo se consiguen los datos de Supabase ni cómo se ven las
// tablas por dentro: solo mantiene el estado de navegación (tab activo,
// mes seleccionado, etc.), conecta los hooks de datos con los
// componentes de presentación, y decide qué renderizar según el tab.
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

function App() {
  // --- Estado de navegación ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pulgosasOpen, setPulgosasOpen] = useState(false);
  const [cubetasOpen, setCubetasOpen] = useState(false);
  const isMobile = useIsMobile(768);

  // --- Estado de filtros compartidos entre tabs ---
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [montoDisponible, setMontoDisponible] = useState('');

  // --- Ordenamiento tipo Excel ---
  const { sortConfig, setSortConfig, requestSort, getSortIcon } = useSortConfig(DEFAULT_SORT_DASHBOARD);

  // Banderas para saber si el tab actual es de Persona o de Proyecto
  const isTransactionTab = TRANSACTION_TABS.includes(activeTab);
  const isProjectTab = PROJECT_TABS.includes(activeTab);

  // Lista fija de meses para el <select>
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  // --- Datos del tab activo ---
  const dashboard = useDashboardData(activeTab, selectedMonth, sortConfig);
  // Nota: Pasamos (isTransactionTab || isProjectTab) para que useTransactionsData se active en ambos tipos de tabs
  const transactions = useTransactionsData(
    activeTab, 
    selectedMonth, 
    isTransactionTab || isProjectTab, 
    mostrarTodos, 
    sortConfig
  );

  const loading = activeTab === 'dashboard' ? dashboard.loading : transactions.loading;

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
                    activeTab={activeTab} // <-- 1. NUEVA PROP (Necesaria para render condicional)
                    isMobile={isMobile}
                    mostrarTodos={mostrarTodos}
                    sortedData={transactions.sortedData}
                    metricasResumen={transactions.metricasResumen}
                    adeudoAnterior={transactions.adeudoAnterior}
                    acumuladoAnterior={transactions.acumuladoAnterior}
                    mostrarAdeudoAnterior={transactions.mostrarAdeudoAnterior}
                    mostrarAcumuladoAnterior={transactions.mostrarAcumuladoAnterior}
                    interesMesAnterior={transactions.interesMesAnterior} // <-- 2. NUEVA PROP
                    interesesAcumulados={transactions.interesesAcumulados} // <-- 3. NUEVA PROP
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