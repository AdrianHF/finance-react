// src/hooks/useDashboardData.js
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Toda la lógica de datos del tab ADRIAN:
 *  1. Fetch de "products" + su "bank_statement" del mes seleccionado.
 *  2. Cálculo de métricas financieras (pagado / por pagar / total).
 *  3. Ordenamiento tipo Excel de la tabla.
 *
 * Antes esto vivía disperso en 3 partes distintas de App.jsx (un
 * useEffect y dos useMemo). Juntarlo en un hook por-tab hace que:
 *  - App.jsx ya no necesite saber CÓMO se consiguen los datos de ADRIAN,
 *    solo que existe `useDashboardData(...)` y le regresa lo que la UI
 *    necesita.
 *  - Si el día de mañana ADRIAN se muda a su propia página, este hook
 *    se puede llevar tal cual.
 *
 * @param {string} activeTab - tab actualmente seleccionado en la app.
 * @param {string} selectedMonth - mes seleccionado, formato "YYYY-MM".
 * @param {{key: string, direction: 'asc'|'desc'}} sortConfig
 */
export function useDashboardData(activeTab, selectedMonth, sortConfig) {
  const [productosData, setProductosData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch de productos + bank_statements del mes seleccionado.
  // Solo se ejecuta cuando el tab activo es "dashboard": los otros tabs
  // no necesitan estos datos, así que evitamos pegarle a Supabase de más.
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

  // 2. Métricas de la cabecera (Pagado / Por Pagar / Total Mensual).
  const metricasFinancieras = useMemo(() => {
    return productosData.reduce(
      (totales, item) => {
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
      },
      { pagado: 0, porPagar: 0, totalGeneral: 0 }
    );
  }, [productosData]);

  // 3. Ordenamiento tipo Excel de la tabla (nombre, fecha límite, estado, monto).
  const sortedData = useMemo(() => {
    const sortableItems = [...productosData];
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
  }, [productosData, sortConfig]);

  return { sortedData, metricasFinancieras, loading };
}
