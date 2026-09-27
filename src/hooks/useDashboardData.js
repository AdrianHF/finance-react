/**
 * @file useDashboardData.js
 * @component useDashboardData
 * @description Hook personalizado que gestiona la obtención, filtrado y cálculo de métricas financieras para el dashboard.
 *
 * Funcionalidades Clave:
 * - Consulta productos y estados de cuenta desde Supabase según el mes y la pestaña activa.
 * - Calcula automáticamente las métricas financieras (pagado, por pagar, total general).
 * - Aplica ordenamiento dinámico a los datos de la tabla según múltiples criterios.
 * - Gestiona el estado de carga durante las peticiones asíncronas.
 *
 * @returns {UseDashboardDataReturn} Objeto que contiene los datos ordenados, métricas financieras y estado de carga.
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Representación del estado de cuenta bancario asociado a un producto.
 * @typedef {Object} BankStatement
 * @property {string|number} bank_statement_id - ID único del estado de cuenta.
 * @property {string} payday_limit - Fecha límite de pago (formato YYYY-MM-DD).
 * @property {number|string} amount - Monto numérico o parseable a float.
 * @property {'PAGADO' | 'POR PAGAR' | 'FALTA CAPTURAR' | 'PRODUCTO INACTIVO'} status - Estado actual del pago.
 */

/**
 * Estructura de un producto obtenido desde Supabase.
 * @typedef {Object} ProductItem
 * @property {string|number} product_id - ID único del producto.
 * @property {string} name - Nombre del producto financiero.
 * @property {BankStatement[]} [bank_statements] - Lista de estados de cuenta asociados.
 */

/**
 * Configuración actual del ordenamiento de datos.
 * @typedef {Object} SortConfig
 * @property {'name' | 'amount' | 'payday_limit' | 'status' | null} key - Columna por la que se ordenará.
 * @property {'asc' | 'desc'} direction - Dirección del ordenamiento.
 */

/**
 * Resumen consolidado de métricas financieras del Dashboard.
 * @typedef {Object} MetricasDashboard
 * @property {number} pagado - Suma de montos con estado 'PAGADO'.
 * @property {number} porPagar - Suma de montos con estado 'POR PAGAR' o 'FALTA CAPTURAR'.
 * @property {number} totalGeneral - Suma total general abonada y por abonar del periodo.
 */

/**
 * Objeto de retorno expuesto por el Custom Hook `useDashboardData`.
 * @typedef {Object} UseDashboardDataReturn
 * @property {ProductItem[]} sortedData - Productos procesados y ordenados según `sortConfig`.
 * @property {MetricasDashboard} metricasFinancieras - Métricas totales (pagado, por pagar, total general).
 * @property {boolean} loading - Estado de carga de la petición asíncrona a Supabase.
 */

/**
 * Custom Hook que encapsula toda la lógica de datos para la vista/tab "ADRIAN" (Dashboard):
 * 1. Consulta la lista de productos y sus estados de cuenta en Supabase para el mes seleccionado.
 * 2. Calcula automáticamente los totales financieros (pagado, por pagar, total general).
 * 3. Aplica ordenamiento a la tabla según la clave de propiedad y dirección especificada.
 *
 * @param {string} activeTab - Tab activo en la UI (solo ejecuta la petición si es igual a `'dashboard'`).
 * @param {string} selectedMonth - Mes en consulta formateado como `"YYYY-MM"`.
 * @param {SortConfig} sortConfig - Criterio actual de ordenamiento de la tabla.
 * @returns {UseDashboardDataReturn} Objeto que contiene los datos listos para renderizar y el estado de carga.
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