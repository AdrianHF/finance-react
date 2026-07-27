// src/App.jsx
//
// Componente raíz de "Dineros". Después de la modularización, App.jsx
// ya NO sabe cómo se consiguen los datos de Supabase ni cómo se ven las
// tablas por dentro: solo mantiene el estado de navegación (tab activo,
// mes seleccionado, etc.), conecta los hooks de datos con los
// componentes de presentación, y decide qué renderizar según el tab.
import React, { useState, useMemo } from 'react';

import { TRANSACTION_TABS, DEFAULT_SORT_DASHBOARD, DEFAULT_SORT_TRANSACTIONS } from './config/constants';
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

  // --- Ordenamiento tipo Excel (se reinicia al cambiar de tab, igual que antes) ---
  const { sortConfig, setSortConfig, requestSort, getSortIcon } = useSortConfig(DEFAULT_SORT_DASHBOARD);

  const isTransactionTab = TRANSACTION_TABS.includes(activeTab);

  // Lista fija de meses para el <select>: no depende de nada, se calcula una sola vez.
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  // --- Datos del tab activo ---
  // Cada hook internamente ignora la petición a Supabase si no es su tab
  // (mismo comportamiento que los `if (activeTab !== 'dashboard') return;`
  // originales), así que es seguro llamarlos siempre en el mismo orden.
  const dashboard = useDashboardData(activeTab, selectedMonth, sortConfig);
  const transactions = useTransactionsData(activeTab, selectedMonth, isTransactionTab, mostrarTodos, sortConfig);

  const loading = activeTab === 'dashboard' ? dashboard.loading : transactions.loading;

  // Cambiar de tab reinicia el ordenamiento, igual que en el código original
  // (dashboard ordena por fecha límite, transacciones por fecha).
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
          isTransactionTab={isTransactionTab}
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

              {isTransactionTab && (
                <>
                  <TransactionsTable
                    isMobile={isMobile}
                    mostrarTodos={mostrarTodos}
                    sortedData={transactions.sortedData}
                    metricasResumen={transactions.metricasResumen}
                    adeudoAnterior={transactions.adeudoAnterior}
                    acumuladoAnterior={transactions.acumuladoAnterior}
                    mostrarAdeudoAnterior={transactions.mostrarAdeudoAnterior}
                    mostrarAcumuladoAnterior={transactions.mostrarAcumuladoAnterior}
                    requestSort={requestSort}
                    getSortIcon={getSortIcon}
                  />
                  <ProjectsSummaryTable isMobile={isMobile} resumenBuckets={transactions.resumenBuckets} />
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
