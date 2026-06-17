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

  // Estado para el selector de meses en la pestaña de MARIE (Año-Mes)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const ahora = new Date();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    return `${ahora.getFullYear()}-${mm}`;
  });

  // =========================================================
  // LÓGICA DE SUPABASE (ESTADOS Y FETCHING)
  // =========================================================
  const [productosData, setProductosData] = useState([]); // Datos pestaña ADRIAN
  const [transactionsData, setTransactionsData] = useState([]); // Datos pestaña MARIE (Del mes seleccionado)
  const [allMarieTransactions, setAllMarieTransactions] = useState([]); // HISTÓRICO COMPLETO MARIE
  const [loading, setLoading] = useState(true);

  // Estado para el ordenamiento de las tablas
  const [sortConfig, setConfig] = useState({ key: null, direction: 'asc' });

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
          .select(`
            *,
            bank_statements!product(bank_statement_id, payday_limit, amount, status)
          `)
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

  // 2. Fetching para pestaña MARIE (Transactions del mes seleccionado)
  useEffect(() => {
    if (activeTab !== 'transacciones') return;

    const getTransactions = async () => {
      try {
        setLoading(true);
        const [ano, mes] = selectedMonth.split('-');
        const primerDia = `${ano}-${mes}-01`;
        const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('transactions')
          .select(`
            transaction_id,
            amount,
            date,
            description,
            money_bucket,
            payer_loaner,
            money_buckets!money_bucket(name),
            products!product(name)
          `)
          .eq('payer_loaner', 7)
          .gte('date', primerDia)
          .lte('date', ultimoDia);

        if (error) throw error;

        const transaccionesProcesadas = (data || []).map(t => {
          const originalAmount = parseFloat(t.amount) || 0;
          return {
            ...t,
            amount: t.money_bucket === 15 ? originalAmount : originalAmount * -1,
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
  }, [activeTab, selectedMonth]);

  // 3. FETCHING HISTÓRICO: Obtiene TODO el universo de transacciones de Marie para balances globales
  useEffect(() => {
    if (activeTab !== 'transacciones') return;

    const getAllMarieTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('amount, date, money_bucket')
          .eq('payer_loaner', 7);

        if (error) throw error;

        const procesadas = (data || []).map(t => {
          const originalAmount = parseFloat(t.amount) || 0;
          return {
            ...t,
            amount: t.money_bucket === 15 ? originalAmount : originalAmount * -1
          };
        });

        setAllMarieTransactions(procesadas);
      } catch (error) {
        console.error('Error al traer histórico de Marie:', error.message);
      }
    };

    getAllMarieTransactions();
  }, [activeTab]);

  // Generar lista de meses fija que termina en Septiembre de 2027 hacia atrás
  const listaMesesOptions = useMemo(() => {
    const opciones = [];
    const fecha = new Date(2027, 8, 1); 
    
    for (let i = 0; i < 24; i++) {
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
    } else if (activeTab === 'transacciones') {
      let sortableItems = [...transactionsData];
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
  }, [productosData, transactionsData, sortConfig, activeTab]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // =========================================================
  // LÓGICA DE CÁLCULO DE TOTALES
  // =========================================================
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

  // =========================================================
  // LÓGICA DE CÁLCULO DE TOTALES REVISADA (PRECISIÓN POR STRINGS)
  // =========================================================
  const metricasMarie = useMemo(() => {
    const [ano, mes] = selectedMonth.split('-');
    const primerDiaMesSeleccionado = `${ano}-${mes}-01`;
    const ultimoDiaNum = new Date(Number(ano), Number(mes), 0).getDate();
    const ultimoDiaMesSeleccionado = `${ano}-${mes}-${String(ultimoDiaNum).padStart(2, '0')}`;

    return allMarieTransactions.reduce((acc, t) => {
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
  }, [allMarieTransactions, selectedMonth]);

  const balanceDelMesMarie = useMemo(() => {
    return transactionsData.reduce((sum, t) => sum + t.amount, 0);
  }, [transactionsData]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      minHeight: '100vh', 
      backgroundColor: '#f4f6f8',
      paddingBottom: isMobile ? '70px' : '0px' // Espacio para el nav de celular
    }}>

      {/* Sidebar (Escritorio) / Navbar (Celular) */}
      {!isMobile ? (
        <aside style={{ width: '260px', backgroundColor: '#465c73', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginBottom: '40px' }}>DINEROS</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => { setActiveTab('dashboard'); setConfig({ key: null, direction: 'asc' }); }} style={tabButtonStyle(activeTab === 'dashboard')}>ADRIAN</button>
            <button onClick={() => { setActiveTab('transacciones'); setConfig({ key: null, direction: 'asc' }); }} style={tabButtonStyle(activeTab === 'transacciones')}>MARIE</button>
            <button onClick={() => setActiveTab('presupuestos')} style={tabButtonStyle(activeTab === 'presupuestos')}>📅 Presupuestos</button>
            <button onClick={() => setActiveTab('inversiones')} style={tabButtonStyle(activeTab === 'inversiones')}>📈 Inversiones</button>
          </nav>
        </aside>
      ) : (
        <nav style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px', 
          backgroundColor: '#465c73', display: 'flex', justifyContent: 'space-around', 
          alignItems: 'center', zIndex: 1000, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' 
        }}>
          <button onClick={() => { setActiveTab('dashboard'); setConfig({ key: null, direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'dashboard')}>ADRIAN</button>
          <button onClick={() => { setActiveTab('transacciones'); setConfig({ key: null, direction: 'asc' }); }} style={mobileTabButtonStyle(activeTab === 'transacciones')}>MARIE</button>
          <button onClick={() => setActiveTab('presupuestos')} style={mobileTabButtonStyle(activeTab === 'presupuestos')}>📅 Presup.</button>
          <button onClick={() => setActiveTab('inversiones')} style={mobileTabButtonStyle(activeTab === 'inversiones')}>📈 Invers.</button>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
              {activeTab === 'dashboard' ? `ADRIAN` : 'MARIE'}
            </h1>
            
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={excelDropdownStyle}
            >
              {listaMesesOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Tarjetas Dinámicas MARIE */}
          {activeTab === 'transacciones' && !loading && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '12px',
              width: isMobile ? '100%' : 'auto'
            }}>
              <div style={metricCardMarieStyle}>
                <span style={metricLabelMarieStyle}>BALANCE TOTAL</span>
                <span style={{ color: metricasMarie.balanceTotal >= 0 ? '#15803d' : '#b91c1c', fontSize: '15px', fontWeight: '800' }}>
                  ${metricasMarie.balanceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div style={metricCardMarieStyle}>
                <span style={metricLabelMarieStyle}>BAL. TOTAL A LA FECHA</span>
                <span style={{ color: metricasMarie.balanceTotalALaFecha >= 0 ? '#15803d' : '#b91c1c', fontSize: '15px', fontWeight: '800' }}>
                  ${metricasMarie.balanceTotalALaFecha.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div style={metricCardMarieStyle}>
                <span style={metricLabelMarieStyle}>BAL. ACUM. MES ANTERIOR</span>
                <span style={{ color: metricasMarie.balanceAnterior >= 0 ? '#475569' : '#b91c1c', fontSize: '15px', fontWeight: '700' }}>
                  ${metricasMarie.balanceAnterior.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ ...metricCardMarieStyle, backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                <span style={metricLabelMarieStyle}>BALANCE DEL MES</span>
                <span style={{ color: balanceDelMesMarie >= 0 ? '#15803d' : '#b91c1c', fontSize: '15px', fontWeight: '800' }}>
                  ${balanceDelMesMarie.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Sección de Contenido */}
        <section>
          {loading ? (
            <div style={placeholderCardStyle}><h3>Cargando datos...</h3></div>
          ) : (
            <>
              {/* TAB 1: ADRIAN */}
              {activeTab === 'dashboard' && (
                <div style={{...tableCardStyle, padding: isMobile ? '16px' : '24px'}}>
                  <div style={{
                    ...metricsHeaderContainer, 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '16px'
                  }}>
                    <span style={sectionTitleStyle}>PAGOS DEL MES</span>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row', 
                      gap: isMobile ? '10px' : '40px', 
                      width: isMobile ? '100%' : 'auto',
                      textAlign: isMobile ? 'left' : 'right' 
                    }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#166534', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Pagado</span>
                        <span style={{ color: '#15803d', fontSize: '15px', fontWeight: '700' }}>
                          ${metricasFinancieras.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Por Pagar</span>
                        <span style={{ color: '#b91c1c', fontSize: '15px', fontWeight: '700' }}>
                          ${metricasFinancieras.porPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ 
                        borderLeft: isMobile ? 'none' : '1px solid #e2e8f0', 
                        borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
                        paddingLeft: isMobile ? '0' : '40px',
                        paddingTop: isMobile ? '10px' : '0'
                      }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Total Mensual</span>
                        <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: '800' }}>
                          ${metricasFinancieras.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenedor Responsive para Scroll en Tablas */}
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
                                {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.payday_limit ? statement.payday_limit : <span style={emptyDashStyle}>—</span>}
                              </td>
                              <td style={tdStyle}>
                                <span style={getStatusBadgeStyle(currentStatus)}>{currentStatus.replace(/_/g, ' ')}</span>
                              </td>
                              <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                                {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.amount !== null ? (
                                  `$${parseFloat(statement.amount).toFixed(2)}`
                                ) : <span style={emptyDashStyle}>—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: MARIE */}
              {activeTab === 'transacciones' && (
                <div style={excelCardStyle}>
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace, sans-serif', minWidth: isMobile ? '650px' : 'auto' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9' }}>
                          <th style={excelThStyle} onClick={() => requestSort('date')}>FECHA {getSortIcon('date')}</th>
                          <th style={excelThStyle} onClick={() => requestSort('description')}>DESCRIPCIÓN {getSortIcon('description')}</th>
                          <th style={excelThStyle} onClick={() => requestSort('money_bucket_name')}>MONEY BUCKET {getSortIcon('money_bucket_name')}</th>
                          <th style={excelThStyle} onClick={() => requestSort('product_name')}>PRODUCTO {getSortIcon('product_name')}</th>
                          <th style={{ ...excelThStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>MONTO {getSortIcon('amount')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ ...excelTdStyle, textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                              No hay transacciones registradas para este periodo.
                            </td>
                          </tr>
                        ) : (
                          sortedData.map((t) => (
                            <tr key={t.transaction_id} style={excelTrStyle}>
                              <td style={excelTdStyle}>{t.date}</td>
                              <td style={excelTdStyle}>{t.description || <span style={emptyDashStyle}>sin descripción</span>}</td>
                              <td style={excelTdStyle}>
                                <span style={bucketLabelStyle}>{t.money_bucket_name}</span>
                              </td>
                              <td style={excelTdStyle}>{t.product_name}</td>
                              <td style={{ 
                                ...excelTdStyle, 
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
              )}

              {/* Placeholders */}
              {(activeTab === 'presupuestos' || activeTab === 'inversiones') && (
                <div style={placeholderCardStyle}>
                  <h3>Módulo de {activeTab.toUpperCase()} en desarrollo</h3>
                </div>
              )}
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
  const baseBadgeStyle = { padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', display: 'inline-block', textAlign: 'center', whiteSpace: 'nowrap' };
  switch (status) {
    case 'PAGADO': return { ...baseBadgeStyle, backgroundColor: '#dcfce7', color: '#166534' };
    case 'POR PAGAR': return { ...baseBadgeStyle, backgroundColor: '#fef9c3', color: '#854d0e' };
    case 'NO DISPONIBLE AUN': return { ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#475569' };
    case 'PRODUCTO INACTIVO': return { ...baseBadgeStyle, backgroundColor: '#e2e8f0', color: '#94a3b8' };
    case 'NO APLICA': return { ...baseBadgeStyle, backgroundColor: '#cbd5e1', color: '#475569', fontStyle: 'italic' };
    default: return { ...baseBadgeStyle, backgroundColor: '#fef2f2', color: '#991b1b' };
  }
};

const tabButtonStyle = (isActive) => ({
  width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', color: '#ffffff',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent', fontWeight: isActive ? '600' : 'normal', transition: 'background 0.2s'
});

const mobileTabButtonStyle = (isActive) => ({
  flex: 1, height: '100%', background: 'none', border: 'none', color: isActive ? '#ffffff' : '#cbd5e1',
  fontSize: '11px', fontWeight: isActive ? '700' : '400', display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
});

const metricCardMarieStyle = {
  textAlign: 'left', 
  backgroundColor: '#ffffff', 
  padding: '10px 14px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

const metricLabelMarieStyle = { 
  fontSize: '9px', 
  color: '#64748b', 
  fontWeight: '700', 
  textTransform: 'uppercase', 
  display: 'block',
  marginBottom: '2px',
  letterSpacing: '0.02em'
};

const excelDropdownStyle = {
  padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#475569', backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', outline: 'none'
};

const excelCardStyle = { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden' };
const excelThStyle = { padding: '10px 14px', fontSize: '11px', fontWeight: '700', color: '#475569', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', userSelect: 'none', whiteSpace: 'nowrap' };
const excelTdStyle = { padding: '10px 14px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #f1f5f9', whiteSpace: 'nowrap' };
const excelTrStyle = { borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' };
const bucketLabelStyle = { backgroundColor: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px' };

const metricsHeaderContainer = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' };
const sectionTitleStyle = { color: '#0f172a', fontSize: '15px', fontWeight: '600', letterSpacing: '0.02em' };
const placeholderCardStyle = { backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', color: '#64748b' };
const tableCardStyle = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const thStyle = { padding: '12px 14px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px 14px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' };
const trHoverStyle = { transition: 'background-color 0.15s' };
const emptyDashStyle = { color: '#94a3b8', fontStyle: 'italic' };

export default App;