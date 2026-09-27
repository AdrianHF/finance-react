// src/hooks/useTransactionsData.js
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  PAYER_LOANER_MAP,
  PERSONAL_BUCKET_MAP,
  PROJECT_BUCKET_MAP,
  PROJECT_TABS,
  TAB_NAMES,
} from '../config/constants';

const TRANSACTIONS_SELECT = `
  transaction_id, amount, date, description, money_bucket, payer_loaner,
  money_buckets!money_bucket(name), payers_loaners!payer_loaner(name),
  products!product(name)
`;

const TASA_INTERES_MENSUAL = 0.0223333;
const INTERES_DESDE = '2025-06';
const INTERES_HASTA = '2026-03';

const toDateStr = (d) => (d ? d.split('T')[0] : '');
const toNum = (v) => parseFloat(v) || 0;
const primerDiaDeMes = (ym) => `${ym}-01`;
const ultimoDiaDeMes = (ym) => {
  const [a, m] = ym.split('-').map(Number);
  const d = new Date(a, m, 0).getDate();
  return `${ym}-${String(d).padStart(2, '0')}`;
};

/** Convierte filas crudas de Supabase en transacciones listas para UI. */
function procesarTransacciones(data, activeTab, fallbackBucketName) {
  const isProject = PROJECT_TABS.includes(activeTab);
  const personalId = PERSONAL_BUCKET_MAP[activeTab];
  return (data || []).map((t) => {
    const amount = toNum(t.amount);
    const esPersonal = t.money_bucket === personalId;
    return {
      ...t,
      amount: isProject || esPersonal ? amount : -amount,
      money_bucket_name: t.money_buckets?.name || fallbackBucketName(t),
      product_name: t.products?.name || '—',
      payer_loaner_name: t.payers_loaners?.name || '—',
    };
  });
}

function calcularMetricasResumen(dataset, isProject) {
  return dataset.reduce((acc, t) => {
    const m = toNum(t.amount);
    if (isProject) {
      if (m < 0) acc.totalMensual += Math.abs(m);
    } else {
      if (m >= 0) acc.pagado += m;
      else acc.totalMensual += Math.abs(m);
      acc.porPagar = acc.totalMensual - acc.pagado;
    }
    return acc;
  }, { pagado: 0, porPagar: 0, totalMensual: 0 });
}

function calcularBalanceHistorico(data, selectedMonth) {
  if (!selectedMonth) return { balanceTotal: 0, balanceAnterior: 0, balanceTotalALaFecha: 0 };
  const ini = primerDiaDeMes(selectedMonth);
  const fin = ultimoDiaDeMes(selectedMonth);
  return data.reduce((acc, t) => {
    const f = toDateStr(t.date);
    const m = Number(t.amount) || 0;
    acc.balanceTotal += m;
    if (f < ini) acc.balanceAnterior += m;
    if (f <= fin) acc.balanceTotalALaFecha += m;
    return acc;
  }, { balanceTotal: 0, balanceAnterior: 0, balanceTotalALaFecha: 0 });
}

/** Suma de intereses desde 2025-06 hasta `mesLimite`, en un solo recorrido. */
function calcularInteresesAcumulados(data, mesLimite) {
  if (!data.length) return 0;
  const sorted = [...data].sort((a, b) => toDateStr(a.date).localeCompare(toDateStr(b.date)));
  let total = 0, balance = 0, idx = 0, ano = 2025, mes = 6;
  while (true) {
    const ym = `${ano}-${String(mes).padStart(2, '0')}`;
    if (ym > mesLimite) break;
    const corte = primerDiaDeMes(ym);
    while (idx < sorted.length && toDateStr(sorted[idx].date) < corte) {
      balance += Number(sorted[idx].amount) || 0;
      idx++;
    }
    if (balance < 0) total += Math.abs(balance) * TASA_INTERES_MENSUAL;
    if (++mes > 12) { mes = 1; ano++; }
  }
  return total;
}

function calcularResumenBuckets(data, activeTab, personalBucketId) {
  const buckets = {};
  let totalDeudaProyectos = 0;
  let totalAportadoPersonal = 0;
  const hoy = new Date().toISOString().split('T')[0];
  const tabName = (TAB_NAMES[activeTab] || '').toUpperCase();

  data.forEach((t) => {
    const bid = t.money_bucket;
    if (!bid) return;
    const esPersonal =
      bid === personalBucketId ||
      (t.money_bucket_name && tabName && t.money_bucket_name.toUpperCase().includes(tabName));

    if (esPersonal) { totalAportadoPersonal += t.amount; return; }

    const b = (buckets[bid] ||= {
      id: bid, name: t.money_bucket_name, deudaTotal: 0,
      totalCuotas: 0, cuotasCompletadas: 0,
      montoTotalCobrado: 0, montoCompletado: 0,
    });

    if (t.amount < 0) {
      const abs = Math.abs(t.amount);
      b.deudaTotal += abs;
      b.totalCuotas += 1;
      b.montoTotalCobrado += abs;
      if (toDateStr(t.date) <= hoy) { b.cuotasCompletadas += 1; b.montoCompletado += abs; }
      totalDeudaProyectos += abs;
    }
  });

  const proyectos = Object.values(buckets).sort((a, b) => b.deudaTotal - a.deudaTotal);
  return {
    proyectos,
    totalDeudaProyectos,
    totalAportadoPersonal,
    restaPorPagarGlobal: totalDeudaProyectos - totalAportadoPersonal,
  };
}

/**
 * Hook universal de transacciones (Personas y Proyectos).
 * Trae el histórico completo desde Supabase y deriva el mes activo en cliente.
 */
export function useTransactionsData(activeTab, selectedMonth, isTransactionTab, mostrarTodos, sortConfig) {
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isProject = PROJECT_TABS.includes(activeTab);
  const payerLoaner = PAYER_LOANER_MAP[activeTab];
  const bucketId = PROJECT_BUCKET_MAP[activeTab];
  const personalBucketId = PERSONAL_BUCKET_MAP[activeTab];
  const shouldFetch = isTransactionTab || isProject;

  // 1. Única consulta: histórico completo filtrado por proyecto o persona.
  useEffect(() => {
    if (!shouldFetch) return;
    let cancelado = false;

    (async () => {
      try {
        setLoading(true);
        let q = supabase.from('transactions').select(TRANSACTIONS_SELECT);
        q = isProject ? q.eq('money_bucket', bucketId) : q.eq('payer_loaner', payerLoaner);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelado) {
          setAllTransactionsData(
            procesarTransacciones(data, activeTab, (t) => `Bucket #${t.money_bucket}`)
          );
        }
      } catch (e) {
        console.error('Error al traer transacciones:', e.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, shouldFetch]);

  // 2. Derivamos el mes activo desde el histórico.
  const transactionsData = useMemo(() => {
    if (!selectedMonth) return [];
    const ini = primerDiaDeMes(selectedMonth);
    const fin = ultimoDiaDeMes(selectedMonth);
    return allTransactionsData.filter((t) => {
      const f = toDateStr(t.date);
      return f >= ini && f <= fin;
    });
  }, [allTransactionsData, selectedMonth]);

  const datasetActivo = mostrarTodos ? allTransactionsData : transactionsData;

  // 3. Ordenamiento tipo Excel.
  const sortedData = useMemo(() => {
    const items = [...datasetActivo];
    if (sortConfig.key === null) return items;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return items.sort((a, b) => {
      let av = a[sortConfig.key];
      let bv = b[sortConfig.key];
      if (sortConfig.key === 'amount') { av = toNum(av); bv = toNum(bv); }
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });
  }, [datasetActivo, sortConfig]);

  // 4. Métricas del dataset activo.
  const metricasResumen = useMemo(
    () => calcularMetricasResumen(datasetActivo, isProject),
    [datasetActivo, isProject]
  );

  // 5. Balance histórico.
  const metricasHistoricas = useMemo(
    () => calcularBalanceHistorico(allTransactionsData, selectedMonth),
    [allTransactionsData, selectedMonth]
  );

  const adeudoAnterior = metricasHistoricas.balanceAnterior < 0 ? Math.abs(metricasHistoricas.balanceAnterior) : 0;
  const acumuladoAnterior = metricasHistoricas.balanceAnterior > 0 ? metricasHistoricas.balanceAnterior : 0;
  const mostrarAdeudoAnterior = !mostrarTodos && adeudoAnterior > 0;
  const mostrarAcumuladoAnterior = !mostrarTodos && acumuladoAnterior > 0;

  // 6. Interés del mes (solo tab 'padre').
  const interesMesAnterior = useMemo(() => {
    if (activeTab !== 'padre' || !selectedMonth) return 0;
    if (selectedMonth < INTERES_DESDE || selectedMonth > INTERES_HASTA) return 0;
    return adeudoAnterior * TASA_INTERES_MENSUAL;
  }, [activeTab, selectedMonth, adeudoAnterior]);

  // 7. Intereses acumulados (solo tab 'padre').
  const interesesAcumulados = useMemo(() => {
    if (activeTab !== 'padre' || !allTransactionsData.length || !selectedMonth) return 0;
    const mesLimite = selectedMonth < INTERES_HASTA ? selectedMonth : INTERES_HASTA;
    return calcularInteresesAcumulados(allTransactionsData, mesLimite);
  }, [activeTab, allTransactionsData, selectedMonth]);

  // 8. Resumen histórico por proyectos (solo personas).
  const resumenBuckets = useMemo(() => {
    if (isProject) return { proyectos: [], totalDeudaProyectos: 0, totalAportadoPersonal: 0, restaPorPagarGlobal: 0 };
    return calcularResumenBuckets(allTransactionsData, activeTab, personalBucketId);
  }, [allTransactionsData, activeTab, isProject, personalBucketId]);

  return {
    sortedData,
    metricasResumen,
    adeudoAnterior,
    acumuladoAnterior,
    mostrarAdeudoAnterior,
    mostrarAcumuladoAnterior,
    interesMesAnterior,
    interesesAcumulados,
    resumenBuckets,
    loading,
  };
}