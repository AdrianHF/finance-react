/**
 * @file useDashboardData.js
 * @description Custom Hook que gestiona la obtención, cálculo de métricas y ordenamiento
 *              de datos financieros del dashboard desde Supabase.
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

/**
 * @param {string} activeTab
 * @param {string} selectedMonth - "YYYY-MM"
 * @param {Object} sortConfig
 */
export function useDashboardData(activeTab, selectedMonth, sortConfig) {
  const [productosData, setProductosData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch de productos + bank_statements del mes seleccionado.
  useEffect(() => {
    if (activeTab !== 'dashboard') return;

    const getProducts = async () => {
      try {
        setLoading(true);
        const [y, m] = selectedMonth.split('-').map(Number);
        const primerDiaMes = new Date(y, m - 1, 1).toISOString().split('T')[0];
        const ultimoDiaMes = new Date(y, m, 0).toISOString().split('T')[0];

        // Query principal (tabla del dashboard)
        const { data, error } = await supabase
          .from('products')
          .select(`*, bank_statements!product(bank_statement_id, starting_period, ending_period, payday_limit, amount, status)`)
          .or(`payday_limit.gte.${primerDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' })
          .or(`payday_limit.lte.${ultimoDiaMes},status.eq.PRODUCTO INACTIVO`, { foreignTable: 'bank_statements' });

        if (error) throw error;
        setProductosData(data || []);

        // Histórico de los últimos 12 meses para la gráfica
        const histMap = {};
        const currDate = new Date(y, m - 1, 1);
        const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

        for (let i = 11; i >= 0; i--) {
          const d = new Date(currDate.getFullYear(), currDate.getMonth() - i, 1);
          const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          histMap[mStr] = { month: mStr, label, total: 0 };
        }

        const startHistKey = Object.keys(histMap)[0];
        const [shY, shM] = startHistKey.split('-').map(Number);
        const firstHistDate = new Date(shY, shM - 1, 1).toISOString().split('T')[0];
        const lastHistDate = new Date(y, m, 0).toISOString().split('T')[0];

        const { data: histData, error: histError } = await supabase
          .from('products')
          .select(`*, bank_statements!product(bank_statement_id, payday_limit, amount, status, starting_period, ending_period)`)
          .or(`payday_limit.gte.${firstHistDate},starting_period.gte.${firstHistDate}`, { foreignTable: 'bank_statements' })
          .or(`payday_limit.lte.${lastHistDate},starting_period.lte.${lastHistDate}`, { foreignTable: 'bank_statements' });

        if (!histError && histData) {
          histData.forEach((prod) => {
            if (!prod.bank_statements) return;
            prod.bank_statements.forEach((st) => {
              // ✅ FIX: agrupar SIEMPRE por payday_limit (fecha real de pago),
              // coherente con la métrica "Por Pagar" y con `SELECT sum(amount) ... GROUP BY payday_limit`.
              const checkDate = st.payday_limit;
              if (!checkDate) return;

              const stMonth = String(checkDate).substring(0, 7);
              if (!histMap[stMonth]) return;

              const amt = parseFloat(st.amount);
              if (Number.isFinite(amt)) {
                histMap[stMonth].total += amt;
              }
            });
          });
        }

        setHistoricalData(Object.values(histMap));
      } catch (error) {
        console.error('Error al conectar con Supabase (Products):', error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [activeTab, selectedMonth]);

  // 2. Métricas de la cabecera (Pagado / Por Pagar / Total Mensual).
  const metricasFinancieras = useMemo(() => {
    return productosData.reduce(
      (totales, item) => {
        // Sumar TODOS los statements del mes, no solo el primero
        const statements = item.bank_statements ?? [];
        for (const st of statements) {
          const monto = parseFloat(st.amount);
          if (!Number.isFinite(monto)) continue;

          const status = st.status;
          if (status === 'PAGADO') {
            totales.pagado += monto;
            totales.totalGeneral += monto;
          } else if (status === 'POR PAGAR' || status === 'FALTA CAPTURAR') {
            totales.porPagar += monto;
            totales.totalGeneral += monto;
          }
        }
        return totales;
      },
      { pagado: 0, porPagar: 0, totalGeneral: 0 }
    );
  }, [productosData]);

  // 3. Ordenamiento de la tabla
  const sortedData = useMemo(() => {
    const sortableItems = [...productosData];
    if (sortConfig.key === null) return sortableItems;

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
        } else if (sortConfig.key === 'starting_period') {
          const aHas = aStatement && aStatement.starting_period;
          const bHas = bStatement && bStatement.starting_period;
          if (!aHas && !bHas) { aValue = 0; bValue = 0; }
          else if (!aHas) { aValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; bValue = bStatement.starting_period; }
          else if (!bHas) { aValue = aStatement.starting_period; bValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; }
          else { aValue = aStatement.starting_period; bValue = bStatement.starting_period; }
        } else if (sortConfig.key === 'ending_period') {
          const aHas = aStatement && aStatement.ending_period;
          const bHas = bStatement && bStatement.ending_period;
          if (!aHas && !bHas) { aValue = 0; bValue = 0; }
          else if (!aHas) { aValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; bValue = bStatement.ending_period; }
          else if (!bHas) { aValue = aStatement.ending_period; bValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; }
          else { aValue = aStatement.ending_period; bValue = bStatement.ending_period; }
        } else if (sortConfig.key === 'payday_limit') {
          const aHas = aStatement && aStatement.payday_limit;
          const bHas = bStatement && bStatement.payday_limit;
          if (!aHas && !bHas) { aValue = 0; bValue = 0; }
          else if (!aHas) { aValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; bValue = bStatement.payday_limit; }
          else if (!bHas) { aValue = aStatement.payday_limit; bValue = sortConfig.direction === 'asc' ? '0000-01-01' : '9999-12-31'; }
          else { aValue = aStatement.payday_limit; bValue = bStatement.payday_limit; }
        } else if (sortConfig.key === 'status') {
          aValue = aStatement ? aStatement.status : 'FALTA CAPTURAR';
          bValue = bStatement ? bStatement.status : 'FALTA CAPTURAR';
        }
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortableItems;
  }, [productosData, sortConfig]);

  return { sortedData, metricasFinancieras, historicalData, loading };
}