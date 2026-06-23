// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import './index.css';
function App() {
  // Estado para saber qué sección de la app de finanzas está activa
  const [activeTab, setActiveTab] = useState('dashboard');
  // Estado para detectar si es pantalla de celular de manera dinámica
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [montoDisponible, setMontoDisponible] = useState('');
  // Estado para el selector de meses en las pestañas de transacciones (Año-Mes)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const ahora = new Date();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    return `${ahora.getFullYear()}-${mm}`;
  });
  // Estado para el botón "TODOS LOS PAGOS" (compartido entre todos los tabs de transacciones)
  const [mostrarTodos, setMostrarTodos] = useState(false);
  // Estado para el acordeón PULGOSAS
  const [pulgosasOpen, setPulgosasOpen] = useState(true);
  // =========================================================
  // MAPEOS DE LOS NUEVOS TABS
  // =========================================================
  const tabNames = {
    dashboard: 'ADRIAN',
    transacciones: 'MARIE',
    ana: 'ANA',
    padre: 'PADRE',
    jefesita: 'JEFESITA',
  };
  const payerLoanerMap = {
    transacciones: 7, // Marie
    ana: 6,           // Ana
    padre: 4,         // Padre
    jefesita: 5,      // Jefesita
  };
  const personalBucketMap = {
    transacciones: 15, // Money bucket personal de Marie
    ana: 14,           // Money bucket personal de Ana
    padre: 1,          // Money bucket personal de Padre
    jefesita: 2,       // Money bucket personal de Jefesita
  };
  const isTransactionTab = ['transacciones', 'ana', 'padre', 'jefesita'].includes(activeTab);
  // =========================================================
  // LÓGICA DE SUPABASE (ESTADOS Y FETCHING)
  // =========================================================
  const [productosData, setProductosData] = useState([]);           // Datos pestaña ADRIAN
  const [transactionsData, setTransactionsData] = useState([]);     // Datos del mes seleccionado (tab activo)
  const [allTransactionsData, setAllTransactionsData] = useState([]); // Histórico completo del payer_loaner activo
  const [loading, setLoading] = useState(true);
  // Estado para el ordenamiento de las tablas
  const [sortConfig, setConfig] = useState({ key: 'payday_limit', direction: 'asc' });
  // 1. Fetching para pestaña ADRIAN (Products)
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    const getProducts = async () => {
      try {
        setLoading(true);
        const [y, m] = selectedMonth.split('-').map(Number);
        const primerDiaMes = new Date(y, m - 1, 1).toISOString().split('T')[0];
        const ultimoDiaMes = new Date(y, m, 0).toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('products')
          .select(`*, bank_statements!product(bank_statement_id, payday_limit, amount, status)`)
          .or(`payday_limit.gte.${primerDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' })
          .or(`payday_limit.lte.${ultimoDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' });
        if (error) throw error;
        setProductosData(data || []);
      } catch (error) {
        console.error('Error al conectar con Supabase (Products):', error.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [activeTab, selectedMonth]);
  // 2. Fetching de transacciones del mes seleccionado (para tabs de transacciones)
  useEffect(() => {
    if (!isTransactionTab) return;
    const payerLoaner = payerLoanerMap[activeTab];
    const getTransactions = async () => {
      try {
        setLoading(true);
        const [ano, mes] = selectedMonth.split('-');
        const primerDia = `${ano}-${mes}-01`;
        const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('transactions')
          .select(`transaction_id, amount, date, description, money_bucket, payer_loaner, money_buckets!money_bucket(name), products!product(name)`)
          .eq('payer_loaner', payerLoaner)
          .gte('date', primerDia)
          .lte('date', ultimoDia);
        if (error) throw error;
        const transaccionesProcesadas = (data || []).map(t => {
          const originalAmount = parseFloat(t.amount) || 0;
          // La lógica del signo se mantiene: si el money_bucket es el personal de Marie (7), se deja positivo; en otros tabs se usa el personalBucketMap
          const esBucketPersonal = t.money_bucket === personalBucketMap[activeTab];
          return {
            ...t,
            amount: esBucketPersonal ? originalAmount : originalAmount * -1,
            money_bucket_name: t.money_buckets?.name || '—',
            product_name: t.products?.name || '—'
          };
        });
        setTransactionsData(transaccionesProcesadas);
      } catch (error) {
        console.error('Error al conectar con Supabase (Transactions):', error.message);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, [activeTab, selectedMonth, isTransactionTab]);
  // 3. Fetching histórico completo para el payer_loaner activo
  useEffect(() => {
    if (!isTransactionTab) return;
    const payerLoaner = payerLoanerMap[activeTab];
    const getAllTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`transaction_id, amount, date, description, money_bucket, payer_loaner, money_buckets!money_bucket(name), products!product(name)`)
          .eq('payer_loaner', payerLoaner);
        if (error) throw error;
        const procesadas = (data || []).map(t => {
          const originalAmount = parseFloat(t.amount) || 0;
          const esBucketPersonal = t.money_bucket === personalBucketMap[activeTab];
          return {
            ...t,
            amount: esBucketPersonal ? originalAmount : originalAmount * -1,
            money_bucket_name: t.money_buckets?.name || `Bucket #${t.money_bucket}`,
            product_name: t.products?.name || '—'
          };
        });
        setAllTransactionsData(procesadas);
      } catch (error) {
        console.error('Error al traer histórico:', error.message);
      }
    };
    getAllTransactions();
  }, [activeTab, isTransactionTab]);
  // Generar lista de meses fija (compartida)
  const listaMesesOptions = useMemo(() => {
    const opciones = [];
    const fecha = new Date(2027, 8, 1);
    for (let i = 0; i < 60; i++) {
      const y = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(fecha);
      opciones.push({ value: `${y}-${m}`, label: nombreMes.toUpperCase() });
      fecha.setMonth(fecha.getMonth() - 1);
    }
    return opciones;
  }, []);
  // =========================================================
  // LÓGICA DE FILTRADO / ORDENAMIENTO (ESTILO EXCEL)
  // =========================================================
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setConfig({ key, direction });
  };
  // Dataset activo del tab de transacciones actual (respeta el botón "TODOS LOS PAGOS")
  const datasetActivo = mostrarTodos ? allTransactionsData : transactionsData;
  const sortedData = useMemo(() => {
    if (activeTab === 'dashboard') {
      let sortableItems = [...productosData];
      if (sortConfig.key !== null) {
        sortableItems.sort((a, b) => {
          let aValue, bValue;
          if (sortConfig.key === 'name') {
            aValue = a.name || '';
            bValue = b.name || '';
          } else {
            const aStatement = a.bank_statements && a.bank_statements[0];
            const bStatement = b.bank_statements && b.bank_statements[0];
            if (sortConfig.key === 'amount') {
              aValue = aStatement && aStatement.amount ? parseFloat(aStatement.amount) : -1;
              bValue = bStatement && bStatement.amount ? parseFloat(bStatement.amount) : -1;
            } else if (sortConfig.key === 'payday_limit') {
              aValue = aStatement ? aStatement.payday_limit : '';
              bValue = bStatement ? bStatement.payday_limit : '';
            } else if (sortConfig.key === 'status') {
              aValue = aStatement ? aStatement.status : 'FALTA CAPTURAR';
              bValue = bStatement ? bStatement.status : 'FALTA CAPTURAR';
            }
          }
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return sortableItems;
    } else if (isTransactionTab) {
      let sortableItems = [...datasetActivo];
      if (sortConfig.key !== null) {
        sortableItems.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];
          if (sortConfig.key === 'amount') {
            aValue = parseFloat(a.amount) || 0;
            bValue = parseFloat(b.amount) || 0;
          }
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return sortableItems;
    }
    return [];
  }, [productosData, datasetActivo, sortConfig, activeTab, isTransactionTab]);
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };
  // =========================================================
  // LÓGICA DE CÁLCULO DE TOTALES
  // =========================================================
  // Métricas ADRIAN
  const metricasFinancieras = useMemo(() => {
    return productosData.reduce((totales, item) => {
      const statement = item.bank_statements && item.bank_statements[0];
      if (statement && statement.amount) {
        const monto = parseFloat(statement.amount);
        const status = statement.status;
        if (status === 'PAGADO') {
          totales.pagado += monto;
          totales.totalGeneral += monto;
        } else if (status === 'POR PAGAR' || status === 'FALTA CAPTURAR') {
          totales.porPagar += monto;
          totales.totalGeneral += monto;
        }
      }
      return totales;
    }, { pagado: 0, porPagar: 0, totalGeneral: 0 });
  }, [productosData]);
  // Métricas resumen del mes para la tabla principal (dataset activo)
  const metricasResumen = useMemo(() => {
    return datasetActivo.reduce((totales, t) => {
      const monto = parseFloat(t.amount) || 0;
      if (monto >= 0) {
        totales.pagado += monto;
      } else {
        totales.totalMensual += Math.abs(monto);
      }
      totales.porPagar = totales.totalMensual - totales.pagado;
      return totales;
    }, { pagado: 0, porPagar: 0, totalMensual: 0 });
  }, [datasetActivo]);
  // Métricas de balance histórico para el tab de transacciones actual
  const metricasHistoricas = useMemo(() => {
    const [ano, mes] = selectedMonth.split('-');
    const primerDiaMesSeleccionado = `${ano}-${mes}-01`;
    const ultimoDiaNum = new Date(Number(ano), Number(mes), 0).getDate();
    const ultimoDiaMesSeleccionado = `${ano}-${mes}-${String(ultimoDiaNum).padStart(2, '0')}`;
    return allTransactionsData.reduce((acc, t) => {
      const fechaTransaccion = t.date.split('T')[0];
      acc.balanceTotal += t.amount;
      if (fechaTransaccion < primerDiaMesSeleccionado) {
        acc.balanceAnterior += t.amount;
      }
      if (fechaTransaccion <= ultimoDiaMesSeleccionado) {
        acc.balanceTotalALaFecha += t.amount;
      }
      return acc;
    }, { balanceTotal: 0, balanceAnterior: 0, balanceTotalALaFecha: 0 });
  }, [allTransactionsData, selectedMonth]);
  // Balance del mes actual
  const balanceDelMes = useMemo(() => {
    return transactionsData.reduce((sum, t) => sum + t.amount, 0);
  }, [transactionsData]);
  // Adeudo anterior: si la suma de todas las transacciones ANTES del mes seleccionado (sin incluir el mes en curso) es negativa, se muestra como deuda
  const adeudoAnterior = metricasHistoricas.balanceAnterior < 0
    ? Math.abs(metricasHistoricas.balanceAnterior)
    : 0;
  // Acumulado anterior: si la suma de todas las transacciones ANTES del mes seleccionado es positiva, se muestra como saldo a favor
  const acumuladoAnterior = metricasHistoricas.balanceAnterior > 0
    ? metricasHistoricas.balanceAnterior
    : 0;
  const mostrarAdeudoAnterior = !mostrarTodos && adeudoAnterior > 0;
  const mostrarAcumuladoAnterior = !mostrarTodos && acumuladoAnterior > 0;
  // =========================================================
  // RESUMEN HISTÓRICO POR PROYECTOS (como en MARIE)
  // =========================================================
  const resumenBuckets = useMemo(() => {
    const bucketsMap = {};
    let totalDeudaProyectos = 0;
    let totalAportadoPersonal = 0;
    const hoyStr = new Date().toISOString().split('T')[0];
    const personalBucketId = personalBucketMap[activeTab];
    allTransactionsData.forEach(t => {
      const bucketId = t.money_bucket;
      if (!bucketId) return;
      const esBucketPersonal = bucketId === personalBucketId || t.money_bucket_name.toUpperCase().includes(tabNames[activeTab].toUpperCase());
      if (esBucketPersonal) {
        totalAportadoPersonal += t.amount;
      } else {
        if (!bucketsMap[bucketId]) {
          bucketsMap[bucketId] = {
            id: bucketId,
            name: t.money_bucket_name,
            deudaTotal: 0,
            totalCuotas: 0,
            cuotasCompletadas: 0,
            montoTotalCobrado: 0,
            montoCompletado: 0
          };
        }
        if (t.amount < 0) {
          const montoAbs = Math.abs(t.amount);
          bucketsMap[bucketId].deudaTotal += montoAbs;
          bucketsMap[bucketId].totalCuotas += 1;
          bucketsMap[bucketId].montoTotalCobrado += montoAbs;
          const fechaTx = t.date.split('T')[0];
          if (fechaTx <= hoyStr) {
            bucketsMap[bucketId].cuotasCompletadas += 1;
            bucketsMap[bucketId].montoCompletado += montoAbs;
          }
          totalDeudaProyectos += montoAbs;
        }
      }
    });
    const listaProyectos = Object.values(bucketsMap).sort((a, b) => b.deudaTotal - a.deudaTotal);
    const restaPorPagarGlobal = totalDeudaProyectos - totalAportadoPersonal;
    return {
      proyectos: listaProyectos,
      totalDeudaProyectos,
      totalAportadoPersonal,
      restaPorPagarGlobal
    };
  }, [allTransactionsData, activeTab, tabNames, personalBucketMap]);
  // Función para obtener el string del mes actual
  const getCurrentMonthString = () => {
    const ahora = new Date();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    return `${ahora.getFullYear()}-${mm}`;
  };
  // =========================================================
  // INTERFAZ
  // =========================================================
  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      paddingBottom: isMobile ? '70px' : '0px'
    }}>
      {/* Sidebar / Navbar */}
      {!isMobile ? (
        <aside style={{
          width: '260px',
          backgroundColor: '#465c73',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
          padding: 0 // eliminamos padding para que el sombreado llegue al borde
        }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', padding: '24px 24px 24px 24px' }}>
            DINEROS
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0', flex: 1 }}>
            <button
              onClick={() => { setActiveTab('dashboard'); setConfig({ key: 'payday_limit', direction: 'asc' }); }}
              style={tabButtonStyle(activeTab === 'dashboard')}
            >
              ADRIAN
            </button>
            {/* Grupo PULGOSAS */}
            <div>
              <button
                onClick={() => setPulgosasOpen(!pulgosasOpen)}
                style={{
                  ...tabButtonStyle(false),
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 24px',
                  margin: 0
                }}
              >
                <span>PULGOSAS</span>
                <span style={{ fontSize: '18px' }}>{pulgosasOpen ? '-' : '+'}</span>
              </button>
              {pulgosasOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px' }}>
                  <button
                    onClick={() => { setActiveTab('transacciones'); setConfig({ key: 'date', direction: 'asc' }); }}
                    style={tabButtonStyle(activeTab === 'transacciones')}
                  >
                    MARIE
                  </button>
                  <button
                    onClick={() => { setActiveTab('ana'); setConfig({ key: 'date', direction: 'asc' }); }}
                    style={tabButtonStyle(activeTab === 'ana')}
                  >
                    ANA
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('padre'); setConfig({ key: 'date', direction: 'asc' }); }}
              style={tabButtonStyle(activeTab === 'padre')}
            >
              PADRE
            </button>
            <button
              onClick={() => { setActiveTab('jefesita'); setConfig({ key: 'date', direction: 'asc' }); }}
              style={tabButtonStyle(activeTab === 'jefesita')}
            >
              JEFESITA
            </button>
          </nav>
        </aside>
      ) : (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65px',
          backgroundColor: '#465c73',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <button onClick={() => { setActiveTab('dashboard'); setConfig({ key: 'payday_limit', direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'dashboard')}>
            ADRIAN
          </button>
          <button onClick={() => { setActiveTab('transacciones'); setConfig({ key: 'date', direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'transacciones')}>
            MARIE
          </button>
          <button onClick={() => { setActiveTab('ana'); setConfig({ key: 'date', direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'ana')}>
            ANA
          </button>
          <button onClick={() => { setActiveTab('padre'); setConfig({ key: 'date', direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'padre')}>
            PADRE
          </button>
          <button onClick={() => { setActiveTab('jefesita'); setConfig({ key: 'date', direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'jefesita')}>
            JEFE
          </button>
        </nav>
      )}
      {/* Main Content */}
      <main style={{ flex: 1, padding: isMobile ? '16px' : '40px', width: '100%', boxSizing: 'border-box' }}>
        {/* Header Unificado */}
        <header style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
              {tabNames[activeTab]}
            </h1>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={isTransactionTab && mostrarTodos}
              style={{
                ...excelDropdownStyle,
                opacity: (isTransactionTab && mostrarTodos) ? 0.5 : 1,
                cursor: (isTransactionTab && mostrarTodos) ? 'not-allowed' : 'pointer'
              }}
            >
              {listaMesesOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Botones TODOS LOS PAGOS / MES ACTUAL (solo para tabs de transacciones) */}
            {isTransactionTab && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => setMostrarTodos(true)}
                  style={textButtonStyle(mostrarTodos)}
                >
                  TODOS LOS PAGOS
                </button>
                <button
                  onClick={() => {
                    setMostrarTodos(false);
                    const ahora = new Date();
                    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
                    setSelectedMonth(`${ahora.getFullYear()}-${mm}`);
                  }}
                  style={textButtonStyle(!mostrarTodos && selectedMonth === getCurrentMonthString())}
                >
                  MES ACTUAL
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Sección de Contenido */}
        <section>
          {loading ? (
            <div style={placeholderCardStyle}><h3>Cargando datos...</h3></div>
          ) : (
            <>
              {/* TAB 1: ADRIAN */}
 {activeTab === 'dashboard' && (
  <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
    
    {/* TRUCO LIKUIDO: Inyectamos estilos globales temporales para fulminar las flechas en Chrome/Safari/Edge */}
    <style>{`
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield; /* Para Firefox */
      }
    `}</style>
    <div style={{
      ...metricsHeaderContainer,
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '16px',
      marginBottom: '20px'
    }}>
      <span style={sectionTitleStyle}>PAGOS DEL MES</span>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '16px' : '40px',
        width: isMobile ? '100%' : 'auto',
        textAlign: 'left',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div>
          <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Pagado</span>
          <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>
            ${metricasFinancieras.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Por Pagar</span>
          <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>
            ${metricasFinancieras.porPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{
          borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
          borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
          paddingLeft: isMobile ? '0' : '40px',
          paddingTop: isMobile ? '10px' : '0'
        }}>
          <span style={{ fontSize: '11px', color: '#000000', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Total Mensual</span>
          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>
            ${metricasFinancieras.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {/* --- CALCULADORA DE RESTANTE --- */}
        <div style={{
          borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
          borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
          paddingLeft: isMobile ? '0' : '40px',
          paddingTop: isMobile ? '10px' : '0',
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>DISPONIBLE</span>
            <input
              type="number"
              placeholder="$ 0.00"
              value={montoDisponible}
              onChange={(e) => setMontoDisponible(e.target.value)}
              style={{
                width: '100px',
                padding: '6px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontWeight: '600',
                textAlign: 'center',
                margin: 0
              }}
            />
          </div>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>FALTANTE</span>
            <div style={{ height: '31px', display: 'flex', alignItems: 'center' }}>
              <span style={{
                color: (metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0)) <= 0 ? '#11532a' : '#b45309',
                fontSize: '14px',
                fontWeight: '800'
              }}>
                ${Math.max(0, metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        {/* --- FIN CALCULADORA --- */}
      </div>
    </div>
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '500px' : 'auto' }}>
        <thead>
          <tr>
            <th style={thStyle} onClick={() => requestSort('name')}>Producto {getSortIcon('name')}</th>
            <th style={thStyle} onClick={() => requestSort('payday_limit')}>Fecha Límite {getSortIcon('payday_limit')}</th>
            <th style={thStyle} onClick={() => requestSort('status')}>Estado {getSortIcon('status')}</th>
            <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>Monto {getSortIcon('amount')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => {
            const statement = item.bank_statements && item.bank_statements[0];
            const tieneInformacionEsteMes = !!statement;
            let currentStatus = tieneInformacionEsteMes ? statement.status : 'FALTA CAPTURAR';
            return (
              <tr key={item.product_id || item.id} style={trHoverStyle}>
                <td style={{ ...tdStyle, fontWeight: '500' }}>{item.name}</td>
                <td style={tdStyle}>
                  {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.payday_limit
                    ? statement.payday_limit
                    : <span style={emptyDashStyle}>—</span>}
                </td>
                <td style={tdStyle}>
                  <span style={getStatusBadgeStyle(currentStatus)}>{currentStatus.replace(/_/g, ' ')}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                  {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.amount !== null
                    ? `$${parseFloat(statement.amount).toFixed(2)}`
                    : <span style={emptyDashStyle}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
              {/* TABS DE TRANSACCIONES (MARIE, ANA, PADRE, JEFESITA) */}
              {isTransactionTab && (
                <>
                  {/* Tabla Principal */}
                  <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
                    <div style={{
                      ...metricsHeaderContainer,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: '16px'
                    }}>
                      <span style={sectionTitleStyle}>
                        {mostrarTodos ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS DEL MES'}
                      </span>
                      <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '10px' : '40px',
                        width: isMobile ? '100%' : 'auto',
                        textAlign: 'left'
                      }}>
                        {mostrarAdeudoAnterior && (
                          <div>
                            <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Adeudo Anterior</span>
                            <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>
                              ${adeudoAnterior.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        {mostrarAcumuladoAnterior && (
                          <div>
                            <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Acumulado Anterior</span>
                            <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>
                              ${acumuladoAnterior.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        <div>
                          <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Pagado</span>
                          <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>
                            ${metricasResumen.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span style={{
                            fontSize: '11px',
                            color: metricasResumen.porPagar < 0 ? '#11532a' : '#991b1b',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            display: 'block'
                          }}>
                            {metricasResumen.porPagar < 0 ? 'Pagado de Más Este Mes' : 'Restante Por Pagar'}
                          </span>
                          <span style={{
                            color: metricasResumen.porPagar < 0 ? '#11532a' : '#991b1b',
                            fontSize: '15px',
                            fontWeight: '700'
                          }}>
                            ${Math.abs(metricasResumen.porPagar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{
                          borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
                          borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
                          paddingLeft: isMobile ? '0' : '40px',
                          paddingTop: isMobile ? '10px' : '0'
                        }}>
                          <span style={{ fontSize: '11px', color: '#000000', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
                            TOTAL A PAGAR
                          </span>
                          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>
                            ${metricasResumen.totalMensual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '650px' : 'auto' }}>
                        <thead>
                          <tr>
                            <th style={thStyle} onClick={() => requestSort('date')}>Fecha {getSortIcon('date')}</th>
                            <th style={thStyle} onClick={() => requestSort('description')}>Descripción {getSortIcon('description')}</th>
                            <th style={thStyle} onClick={() => requestSort('money_bucket_name')}>Money Bucket {getSortIcon('money_bucket_name')}</th>
                            <th style={thStyle} onClick={() => requestSort('product_name')}>Producto {getSortIcon('product_name')}</th>
                            <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>Monto {getSortIcon('amount')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedData.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                                No hay transacciones registradas para este periodo.
                              </td>
                            </tr>
                          ) : (
                            sortedData.map((t) => (
                              <tr key={t.transaction_id} style={trHoverStyle}>
                                <td style={tdStyle}>{t.date}</td>
                                <td style={tdStyle}>{t.description || <span style={emptyDashStyle}>sin descripción</span>}</td>
                                <td style={tdStyle}>
                                  <span style={bucketLabelStyle}>{t.money_bucket_name}</span>
                                </td>
                                <td style={tdStyle}>{t.product_name}</td>
                                <td style={{
                                  ...tdStyle,
                                  textAlign: 'right',
                                  fontWeight: '600',
                                  color: t.amount >= 0 ? '#16a34a' : '#dc2626'
                                }}>
                                  {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* RESUMEN HISTÓRICO POR PROYECTOS */}
                  <div style={{ marginTop: '40px' }}>
                    <div style={excelCardStyle}>
                      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace, sans-serif', minWidth: isMobile ? '760px' : 'auto' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                              <th style={excelThStyle}>DEUDAS</th>
                              <th style={excelThStyle}>
                                PROGRESO EN PAGOS{' '}
                                <span title="El progreso mostrado corresponde a los cobros que el banco ya ha procesado, no necesariamente a tus pagos. Si pagas a tiempo, ambos coincidirán." style={infoIconStyle}>
                                  i
                                </span>
                              </th>
                              <th style={{ ...excelThStyle, textAlign: 'right' }}>TOTAL CONSUMIDO / ADEUDADO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resumenBuckets.proyectos.length === 0 ? (
                              <tr>
                                <td colSpan="3" style={{ ...excelTdStyle, textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                                  No hay cobros de proyectos registrados.
                                </td>
                              </tr>
                            ) : (
                              resumenBuckets.proyectos.map((proyecto) => {
                                const porcentaje = proyecto.totalCuotas > 0 ? (proyecto.cuotasCompletadas / proyecto.totalCuotas) * 100 : 0;
                                return (
                                  <tr key={proyecto.id} style={excelTrStyle}>
                                    <td style={{ ...excelTdStyle, fontWeight: '500' }}>
                                      {proyecto.name.toUpperCase()}
                                      <span style={{ fontSize: '10px', color: '#64748b' }}>(ID: {proyecto.id})</span>
                                    </td>
                                    <td style={{ ...excelTdStyle, whiteSpace: 'nowrap' }}>
                                      <div style={{ width: '250px' }}>
                                        <div style={progressBarTrackStyle}>
                                          <div style={progressBarFillStyle(porcentaje)} />
                                        </div>
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          marginTop: '4px',
                                          fontSize: '11px',
                                          color: '#64748b',
                                          fontWeight: '400'
                                        }}>
                                          <div>({proyecto.cuotasCompletadas} / {proyecto.totalCuotas})</div>
                                          <div>
                                            (${proyecto.montoCompletado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${proyecto.montoTotalCobrado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ ...excelTdStyle, textAlign: 'right', color: '#475569', fontWeight: '600' }}>
                                      ${proyecto.deudaTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                          <tfoot style={{ borderTop: '2px solid #cbd5e1', fontWeight: '700' }}>
                            <tr style={{ backgroundColor: '#fdf2f2' }}>
                              <td colSpan="2" style={{ ...excelTdStyle, color: '#991b1b' }}>DEUDA TOTAL</td>
                              <td style={{ ...excelTdStyle, textAlign: 'right', color: '#991b1b', fontWeight: '800' }}>
                                ${resumenBuckets.totalDeudaProyectos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                            <tr style={{ backgroundColor: '#f0fdf4' }}>
                              <td colSpan="2" style={{ ...excelTdStyle, color: '#16a34a' }}>DINERO RECIBIDO</td>
                              <td style={{ ...excelTdStyle, textAlign: 'right', color: '#16a34a', fontWeight: '800' }}>
                                ${resumenBuckets.totalAportadoPersonal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                            <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #94a3b8' }}>
                              <td colSpan="2" style={{ ...excelTdStyle, color: '#0f172a', fontSize: '13px', fontWeight: '800' }}>
                                MONTO RESTANTE POR PAGAR
                              </td>
                              <td style={{
                                ...excelTdStyle,
                                textAlign: 'right',
                                color: resumenBuckets.restaPorPagarGlobal <= 0 ? '#16a34a' : '#b91c1c',
                                fontSize: '14px',
                                fontWeight: '900'
                              }}>
                                ${resumenBuckets.restaPorPagarGlobal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* No hay módulos en desarrollo, eliminamos los placeholders */}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
/* =========================================================
   ESTILOS COMPARTIDOS Y CONFIGURACIONES
========================================================= */
const getStatusBadgeStyle = (status) => {
  const baseBadgeStyle = {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  };
  switch (status) {
    case 'PAGADO': return { ...baseBadgeStyle, backgroundColor: '#b5e2c5', color: '#33704a' };
    case 'POR PAGAR': return { ...baseBadgeStyle, backgroundColor: '#e9e4ab', color: '#946128' };
    case 'NO DISPONIBLE AUN': return { ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#475569' };
    case 'PRODUCTO INACTIVO': return { ...baseBadgeStyle, backgroundColor: '#e2e8f0', color: '#94a3b8' };
    case 'NO APLICA': return { ...baseBadgeStyle, backgroundColor: '#cbd5e1', color: '#475569', fontStyle: 'italic' };
    default: return { ...baseBadgeStyle, backgroundColor: '#fef2f2', color: '#991b1b' };
  }
};
// Botón del sidebar (ahora sin márgenes laterales para cubrir todo el ancho)
const tabButtonStyle = (isActive) => ({
  width: '100%',
  textAlign: 'left',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '0',
  fontSize: '15px',
  cursor: 'pointer',
  color: '#ffffff',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  fontWeight: isActive ? '600' : 'normal',
  transition: 'background 0.2s',
  margin: 0,
  display: 'block'
});
const mobileTabButtonStyle = (isActive) => ({
  flex: 1,
  height: '100%',
  background: 'none',
  border: 'none',
  color: isActive ? '#ffffff' : '#cbd5e1',
  fontSize: '10px',
  fontWeight: isActive ? '700' : '400',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
});
// Botón de texto para TODOS LOS PAGOS / MES ACTUAL
const textButtonStyle = (isHighlighted) => ({
  backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  color: isHighlighted ? '#1e3a8a' : '#64748b',
  border: isHighlighted ? '1px solid #3b82f6' : '1px solid transparent',
  borderRadius: '8px',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  outline: 'none'
});
const excelDropdownStyle = {
  padding: '6px 12px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#475569',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  cursor: 'pointer',
  outline: 'none'
};
const excelCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  overflow: 'hidden'
};
const excelThStyle = {
  padding: '10px 14px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#475569',
  borderBottom: '2px solid #cbd5e1',
  borderRight: '1px solid #e2e8f0',
  cursor: 'pointer',
  textAlign: 'left',
  userSelect: 'none',
  whiteSpace: 'nowrap'
};
const excelTdStyle = {
  padding: '10px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #e2e8f0',
  borderRight: '1px solid #f1f5f9',
  whiteSpace: 'nowrap'
};
const excelTrStyle = {
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#ffffff'
};
const bucketLabelStyle = {
  backgroundColor: '#f8fafc',
  padding: '2px 6px',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
  fontSize: '11px'
};
const metricsHeaderContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '1px solid #f1f5f9'
};
const sectionTitleStyle = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.02em'
};
const placeholderCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px dashed #cbd5e1',
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  color: '#64748b'
};
const tableCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};
const thStyle = {
  padding: '12px 14px',
  fontSize: '11px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  textAlign: 'left',
  borderBottom: '2px solid #e2e8f0',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};
const tdStyle = {
  padding: '12px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  whiteSpace: 'nowrap'
};
const trHoverStyle = {
  transition: 'background-color 0.15s'
};
const emptyDashStyle = {
  color: '#94a3b8',
  fontStyle: 'italic'
};
// Tooltip de información (i)
const infoIconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: '#cbd5e1',
  color: '#ffffff',
  fontSize: '10px',
  fontStyle: 'italic',
  fontWeight: '700',
  cursor: 'help',
  userSelect: 'none'
};
// Barra de progreso de pagos
const progressBarTrackStyle = {
  width: '100%',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  overflow: 'hidden'
};
const progressBarFillStyle = (porcentaje) => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, porcentaje))}%`,
  backgroundColor: porcentaje >= 100 ? '#16a34a' : '#3b82f6',
  borderRadius: '4px',
  transition: 'width 0.3s ease'
});
export default App;