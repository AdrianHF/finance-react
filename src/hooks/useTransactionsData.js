// src/hooks/useTransactionsData.js
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  PAYER_LOANER_MAP, 
  PERSONAL_BUCKET_MAP, 
  PROJECT_BUCKET_MAP, 
  PROJECT_TABS, 
  TAB_NAMES 
} from '../config/constants';

const TRANSACTIONS_SELECT = `
  transaction_id, 
  amount, 
  date, 
  description, 
  money_bucket, 
  payer_loaner, 
  money_buckets!money_bucket(name), 
  payers_loaners!payer_loaner(name),
  products!product(name)
  `
;

/**
 * Convierte los registros crudos de Supabase en objetos listos para la UI.
 */
function procesarTransacciones(data, activeTab, fallbackBucketName) {
  const isProject = PROJECT_TABS.includes(activeTab);

  return (data || []).map((t) => {
    const originalAmount = parseFloat(t.amount) || 0;
    
    // Para proyectos, conservamos el monto real.
    // Para personas, invertimos según si es su bucket personal.
    let finalAmount = originalAmount;
    if (!isProject) {
      const esBucketPersonal = t.money_bucket === PERSONAL_BUCKET_MAP[activeTab];
      finalAmount = esBucketPersonal ? originalAmount : originalAmount * -1;
    }

    return {
      ...t,
      amount: finalAmount,
      money_bucket_name: t.money_buckets?.name || fallbackBucketName(t),
      product_name: t.products?.name || '—',
      payer_loaner_name: t.payers_loaners?.name || '—',
    };
  });
}

/**
 * Hook universal de transacciones (Personas y Proyectos)
 */
export function useTransactionsData(activeTab, selectedMonth, isTransactionTab, mostrarTodos, sortConfig) {
  const [transactionsData, setTransactionsData] = useState([]);
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isProject = PROJECT_TABS.includes(activeTab);
  const payerLoaner = PAYER_LOANER_MAP[activeTab];
  const bucketId = PROJECT_BUCKET_MAP[activeTab];

  // Evalúa si el tab activo requiere hacer fetch de transacciones
  const shouldFetch = isTransactionTab || isProject;

  // 1. Transacciones del mes seleccionado.
  useEffect(() => {
    if (!shouldFetch) return;

    const getTransactions = async () => {
      try {
        setLoading(true);
        const [ano, mes] = selectedMonth.split('-');
        const primerDia = `${ano}-${mes}-01`;
        const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0];

        let query = supabase
          .from('transactions')
          .select(TRANSACTIONS_SELECT)
          .gte('date', primerDia)
          .lte('date', ultimoDia);

        // Aplica el filtro correcto según si es Proyecto o Persona
        if (isProject) {
          query = query.eq('money_bucket', bucketId);
        } else {
          query = query.eq('payer_loaner', payerLoaner);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTransactionsData(procesarTransacciones(data, activeTab, () => '—'));
      } catch (error) {
        console.error('Error al conectar con Supabase (Transactions):', error.message);
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedMonth, shouldFetch]);

  // 2. Histórico completo (todas las fechas).
  useEffect(() => {
    if (!shouldFetch) return;

    const getAllTransactions = async () => {
      try {
        let query = supabase.from('transactions').select(TRANSACTIONS_SELECT);

        if (isProject) {
          query = query.eq('money_bucket', bucketId);
        } else {
          query = query.eq('payer_loaner', payerLoaner);
        }

        const { data, error } = await query;

        if (error) throw error;
        setAllTransactionsData(
          procesarTransacciones(data, activeTab, (t) => `Bucket #${t.money_bucket}`)
        );
      } catch (error) {
        console.error('Error al traer histórico:', error.message);
      }
    };

    getAllTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, shouldFetch]);

  // Dataset activo: respeta el botón "TODOS LOS PAGOS" vs. mes seleccionado.
  const datasetActivo = mostrarTodos ? allTransactionsData : transactionsData;

  // 3. Ordenamiento tipo Excel.
  const sortedData = useMemo(() => {
    const sortableItems = [...datasetActivo];
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
  }, [datasetActivo, sortConfig]);

// 4. Métricas del dataset activo.
  const metricasResumen = useMemo(() => {
    return datasetActivo.reduce(
      (totales, t) => {
        const monto = parseFloat(t.amount) || 0;

        if (isProject) {
          // Si el monto es negativo, lo convertimos a positivo y lo sumamos
          if (monto < 0) {
            totales.totalMensual += Math.abs(monto);
          }
        } else {
          // Lógica para personas
          if (monto >= 0) {
            totales.pagado += monto;
          } else {
            totales.totalMensual += Math.abs(monto);
          }
          totales.porPagar = totales.totalMensual - totales.pagado;
        }
        return totales;
      },
      { pagado: 0, porPagar: 0, totalMensual: 0 }
    );
  }, [datasetActivo, isProject]);

  // 5. Balance histórico.
  const metricasHistoricas = useMemo(() => {
    if (isProject) return { balanceTotal: 0, balanceAnterior: 0, balanceTotalALaFecha: 0 };

    const [ano, mes] = selectedMonth.split('-');
    const primerDiaMesSeleccionado = `${ano}-${mes}-01`;
    const ultimoDiaNum = new Date(Number(ano), Number(mes), 0).getDate();
    const ultimoDiaMesSeleccionado = `${ano}-${mes}-${String(ultimoDiaNum).padStart(2, '0')}`;

    return allTransactionsData.reduce(
      (acc, t) => {
        const fechaTransaccion = t.date.split('T')[0];
        acc.balanceTotal += t.amount;
        if (fechaTransaccion < primerDiaMesSeleccionado) {
          acc.balanceAnterior += t.amount;
        }
        if (fechaTransaccion <= ultimoDiaMesSeleccionado) {
          acc.balanceTotalALaFecha += t.amount;
        }
        return acc;
      },
      { balanceTotal: 0, balanceAnterior: 0, balanceTotalALaFecha: 0 }
    );
  }, [allTransactionsData, selectedMonth, isProject]);

  const adeudoAnterior = metricasHistoricas.balanceAnterior < 0 ? Math.abs(metricasHistoricas.balanceAnterior) : 0;
  const acumuladoAnterior = metricasHistoricas.balanceAnterior > 0 ? metricasHistoricas.balanceAnterior : 0;
  const mostrarAdeudoAnterior = !mostrarTodos && adeudoAnterior > 0;
  const mostrarAcumuladoAnterior = !mostrarTodos && acumuladoAnterior > 0;

  // 6. Resumen histórico por proyectos (solo aplica para personas).
  const resumenBuckets = useMemo(() => {
    if (isProject) return { proyectos: [], totalDeudaProyectos: 0, totalAportadoPersonal: 0, restaPorPagarGlobal: 0 };

    const bucketsMap = {};
    let totalDeudaProyectos = 0;
    let totalAportadoPersonal = 0;
    const hoyStr = new Date().toISOString().split('T')[0];
    const personalBucketId = PERSONAL_BUCKET_MAP[activeTab];

    allTransactionsData.forEach((t) => {
      const bucketId = t.money_bucket;
      if (!bucketId) return;

      const esBucketPersonal =
        bucketId === personalBucketId ||
        (t.money_bucket_name && TAB_NAMES[activeTab] && t.money_bucket_name.toUpperCase().includes(TAB_NAMES[activeTab].toUpperCase()));

      if (esBucketPersonal) {
        totalAportadoPersonal += t.amount;
        return;
      }

      if (!bucketsMap[bucketId]) {
        bucketsMap[bucketId] = {
          id: bucketId,
          name: t.money_bucket_name,
          deudaTotal: 0,
          totalCuotas: 0,
          cuotasCompletadas: 0,
          montoTotalCobrado: 0,
          montoCompletado: 0,
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
    });

    const proyectos = Object.values(bucketsMap).sort((a, b) => b.deudaTotal - a.deudaTotal);
    const restaPorPagarGlobal = totalDeudaProyectos - totalAportadoPersonal;

    return { proyectos, totalDeudaProyectos, totalAportadoPersonal, restaPorPagarGlobal };
  }, [allTransactionsData, activeTab, isProject]);

  return {
    sortedData,
    metricasResumen,
    adeudoAnterior,
    acumuladoAnterior,
    mostrarAdeudoAnterior,
    mostrarAcumuladoAnterior,
    resumenBuckets,
    loading,
  };
}