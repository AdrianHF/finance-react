// src/hooks/useTransactionsData.js
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { PAYER_LOANER_MAP, PERSONAL_BUCKET_MAP, TAB_NAMES } from '../config/constants';

// Columnas que trae la consulta de transacciones. Se centraliza en una
// constante porque el mismo select se repetía IDÉNTICO en dos consultas
// distintas (mes seleccionado e histórico completo); si el día de mañana
// se necesita una columna nueva, ahora solo hay que tocarla en un lugar.
const TRANSACTIONS_SELECT = `transaction_id, amount, date, description, money_bucket, payer_loaner, money_buckets!money_bucket(name), products!product(name)`;

/**
 * Convierte los registros crudos de Supabase en objetos listos para la UI:
 *  - Aplica el signo del monto (positivo si es el bucket personal de la
 *    persona del tab, negativo si es gasto de un proyecto/bucket ajeno).
 *  - Resuelve nombres de bucket/producto con un fallback cuando no hay
 *    relación (money_bucket_name / product_name).
 *
 * `fallbackBucketName` existe porque en el código original el fallback
 * era distinto según la consulta: "—" para la tabla del mes, y
 * "Bucket #<id>" para el histórico completo (se usa en el resumen por
 * proyectos, donde un ID es más útil que un guion). Se preserva esa
 * diferencia tal cual estaba.
 */
function procesarTransacciones(data, activeTab, fallbackBucketName) {
  return (data || []).map((t) => {
    const originalAmount = parseFloat(t.amount) || 0;
    const esBucketPersonal = t.money_bucket === PERSONAL_BUCKET_MAP[activeTab];
    return {
      ...t,
      amount: esBucketPersonal ? originalAmount : originalAmount * -1,
      money_bucket_name: t.money_buckets?.name || fallbackBucketName(t),
      product_name: t.products?.name || '—',
    };
  });
}

/**
 * Toda la lógica de datos de los tabs de transacciones (MARIE, ANA,
 * PADRE, JEFESITA):
 *  1. Fetch de transacciones del mes seleccionado.
 *  2. Fetch del histórico completo (para balances y resumen por proyectos).
 *  3. Ordenamiento tipo Excel.
 *  4. Métricas del mes (pagado / restante / total mensual).
 *  5. Balance histórico (adeudo/acumulado anterior al mes seleccionado).
 *  6. Resumen por proyectos (deuda total, progreso de cobro, etc).
 *
 * @param {string} activeTab
 * @param {string} selectedMonth - formato "YYYY-MM"
 * @param {boolean} isTransactionTab - true si activeTab es un tab de transacciones
 * @param {boolean} mostrarTodos - true si el toggle "TODOS LOS PAGOS" está activo
 * @param {{key: string, direction: 'asc'|'desc'}} sortConfig
 */
export function useTransactionsData(activeTab, selectedMonth, isTransactionTab, mostrarTodos, sortConfig) {
  const [transactionsData, setTransactionsData] = useState([]);
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const payerLoaner = PAYER_LOANER_MAP[activeTab];

  // 1. Transacciones del mes seleccionado.
  useEffect(() => {
    if (!isTransactionTab) return;

    const getTransactions = async () => {
      try {
        setLoading(true);
        const [ano, mes] = selectedMonth.split('-');
        const primerDia = `${ano}-${mes}-01`;
        const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('transactions')
          .select(TRANSACTIONS_SELECT)
          .eq('payer_loaner', payerLoaner)
          .gte('date', primerDia)
          .lte('date', ultimoDia);

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
  }, [activeTab, selectedMonth, isTransactionTab]);

  // 2. Histórico completo del payer_loaner activo (todas las fechas).
  useEffect(() => {
    if (!isTransactionTab) return;

    const getAllTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(TRANSACTIONS_SELECT)
          .eq('payer_loaner', payerLoaner);

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
  }, [activeTab, isTransactionTab]);

  // Dataset activo: respeta el botón "TODOS LOS PAGOS" vs. mes seleccionado.
  const datasetActivo = mostrarTodos ? allTransactionsData : transactionsData;

  // 3. Ordenamiento tipo Excel del dataset activo.
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

  // 4. Métricas del dataset activo (Pagado Este Mes / Restante / Total Mensual).
  const metricasResumen = useMemo(() => {
    return datasetActivo.reduce(
      (totales, t) => {
        const monto = parseFloat(t.amount) || 0;
        if (monto >= 0) {
          totales.pagado += monto;
        } else {
          totales.totalMensual += Math.abs(monto);
        }
        totales.porPagar = totales.totalMensual - totales.pagado;
        return totales;
      },
      { pagado: 0, porPagar: 0, totalMensual: 0 }
    );
  }, [datasetActivo]);

  // 5. Balance histórico: cuánto se debía/acumulaba ANTES del mes seleccionado.
  const metricasHistoricas = useMemo(() => {
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
  }, [allTransactionsData, selectedMonth]);

  const adeudoAnterior = metricasHistoricas.balanceAnterior < 0 ? Math.abs(metricasHistoricas.balanceAnterior) : 0;
  const acumuladoAnterior = metricasHistoricas.balanceAnterior > 0 ? metricasHistoricas.balanceAnterior : 0;
  const mostrarAdeudoAnterior = !mostrarTodos && adeudoAnterior > 0;
  const mostrarAcumuladoAnterior = !mostrarTodos && acumuladoAnterior > 0;

  // 6. Resumen histórico por proyectos (deuda total, % de cobro, etc).
  const resumenBuckets = useMemo(() => {
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
        t.money_bucket_name.toUpperCase().includes(TAB_NAMES[activeTab].toUpperCase());

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
  }, [allTransactionsData, activeTab]);

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
