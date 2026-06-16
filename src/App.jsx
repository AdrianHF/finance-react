// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient'; 

import './index.css';

function App() {
  // Estado para saber qué sección de la app de finanzas está activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Obtiene el mes actual en español y lo convierte a MAYÚSCULAS
  const mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date()).toUpperCase();

  // =========================================================
  // LÓGICA DE SUPABASE (ESTADOS Y FETCHING)
  // =========================================================
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el ordenamiento de la tabla
  const [sortConfig, setConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const ahora = new Date();
        const y = ahora.getFullYear();
        const m = ahora.getMonth();
        
        const primerDiaMes = new Date(y, m, 1).toISOString().split('T')[0];
        const ultimoDiaMes = new Date(y, m + 1, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            bank_statements!product(bank_statement_id, payday_limit, amount, status)
          `)
          .or(`payday_limit.gte.${primerDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' })
          .or(`payday_limit.lte.${ultimoDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' });

        if (error) throw error;
        setTransacciones(data || []);
      } catch (error) {
        console.error('Error al conectar con Supabase:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
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

  const sortedTransacciones = useMemo(() => {
    let sortableItems = [...transacciones];
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
  }, [transacciones, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // =========================================================
  // LÓGICA DE CÁLCULO DE TOTALES (MÉTRICAS UNIFICADAS)
  // =========================================================
  const metricasFinancieras = useMemo(() => {
    return transacciones.reduce((totales, item) => {
      const statement = item.bank_statements && item.bank_statements[0];
      
      if (statement && statement.amount) {
        const monto = parseFloat(statement.amount);
        const status = statement.status;

        // Clasificación por estatus específicos
        if (status === 'PAGADO') {
          totales.pagado += monto;
          totales.totalGeneral += monto;
        } else if (status === 'POR PAGAR' || status === 'FALTA CAPTURAR') {
          totales.porPagar += monto;
          totales.totalGeneral += monto;
        }
        // PRODUCTO INACTIVO, NO DISPONIBLE AUN y NO APLICA se ignoran matemáticamente
      }
      return totales;
    }, { pagado: 0, porPagar: 0, totalGeneral: 0 });
  }, [transacciones]);


  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>

      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#465c73', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginBottom: '40px' }}>DINEROS</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={tabButtonStyle(activeTab === 'dashboard')}>ADRIAN</button>
          <button onClick={() => setActiveTab('transacciones')} style={tabButtonStyle(activeTab === 'transacciones')}>💸 Transacciones</button>
          <button onClick={() => setActiveTab('presupuestos')} style={tabButtonStyle(activeTab === 'presupuestos')}>📅 Presupuestos</button>
          <button onClick={() => setActiveTab('inversiones')} style={tabButtonStyle(activeTab === 'inversiones')}>📈 Inversiones</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1e293b' }}>{activeTab === 'dashboard' && mesActual}</h1>
        </header>

        <section>
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <div style={placeholderCardStyle}><h3>Cargando datos...</h3></div>
              ) : (
                <div style={tableCardStyle}>
                  
                  {/* ENCABEZADO DE METRICAS ALINEADO */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '25px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      PAGOS DEL MES
                    </span>
                    
                    {/* Contenedor de los 3 Campos Financieros */}
                    <div style={{ display: 'flex', gap: '40px', textAlign: 'right' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#166534', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        Pagado
                        </span>
                        <span style={{ color: '#15803d', fontSize: '16px', fontWeight: '700' }}>
                          ${metricasFinancieras.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div>
                        <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        Por Pagar
                        </span>
                        <span style={{ color: '#b91c1c', fontSize: '16px', fontWeight: '700' }}>
                          ${metricasFinancieras.porPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '40px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          Total Mensual
                        </span>
                        <span style={{ color: '#0f172a', fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                          ${metricasFinancieras.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabla Interactiva */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle} onClick={() => requestSort('name')}>Producto {getSortIcon('name')}</th>
                          <th style={thStyle} onClick={() => requestSort('payday_limit')}>Fecha Límite {getSortIcon('payday_limit')}</th>
                          <th style={thStyle} onClick={() => requestSort('status')}>Estado {getSortIcon('status')}</th>
                          <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>Monto {getSortIcon('amount')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedTransacciones.map((item) => {
                          const statement = item.bank_statements && item.bank_statements[0];
                          const tieneInformacionEsteMes = !!statement;
                          
                          let currentStatus = 'FALTA CAPTURAR';
                          if (tieneInformacionEsteMes) {
                            currentStatus = statement.status;
                          }

                          return (
                            <tr 
                              key={item.product_id || item.id} 
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <td style={{ ...tdStyle, fontWeight: '500' }}>{item.name}</td>
                              
                              <td style={tdStyle}>
                                {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.payday_limit ? (
                                  statement.payday_limit
                                ) : (
                                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                                )}
                              </td>

                              <td style={tdStyle}>
                                <span style={getStatusBadgeStyle(currentStatus)}>
                                  {currentStatus.replace(/_/g, ' ')}
                                </span>
                              </td>

                              <td style={{ ...tdStyle, textAlign: 'right' }}>
                                {tieneInformacionEsteMes && currentStatus !== 'PRODUCTO INACTIVO' && currentStatus !== 'NO APLICA' && statement.amount !== null ? (
                                  <span style={{ fontWeight: '600' }}>
                                    ${parseFloat(statement.amount).toFixed(2)}
                                  </span>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   ESTILOS AUXILIARES Y GESTOR DE BADGES
   ========================================================= */
const getStatusBadgeStyle = (status) => {
  const baseBadgeStyle = {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    display: 'inline-block',
    textAlign: 'center'
  };

  switch (status) {
    case 'PAGADO':
      return { ...baseBadgeStyle, backgroundColor: '#dcfce7', color: '#166534' };
    case 'POR PAGAR':
      return { ...baseBadgeStyle, backgroundColor: '#fef9c3', color: '#854d0e' };
    case 'NO DISPONIBLE AUN':
      return { ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#475569' };
    case 'PRODUCTO INACTIVO':
      return { ...baseBadgeStyle, backgroundColor: '#e2e8f0', color: '#94a3b8' };
    case 'NO APLICA':
      return { ...baseBadgeStyle, backgroundColor: '#cbd5e1', color: '#475569', fontStyle: 'italic' };
    case 'FALTA CAPTURAR':
    default:
      return { ...baseBadgeStyle, backgroundColor: '#fef2f2', color: '#991b1b' };
  }
};

const tabButtonStyle = (isActive) => ({
  width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', color: '#ffffff',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent', fontWeight: isActive ? '600' : 'normal',
});

const placeholderCardStyle = { backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#64748b' };
const tableCardStyle = { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0' };
const thStyle = { padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', cursor: 'pointer' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9' };

export default App;