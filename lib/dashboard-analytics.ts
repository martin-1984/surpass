import { parseEmisionDate } from "@/lib/date-emision";
import { providerLabel } from "@/lib/format";
import type { Factura } from "@/lib/types/database";

export interface DashboardFilterParams {
  year: number;
  month: number | null;
  proveedor: string | null;
}

export interface MesAggregate {
  mes: number;
  label: string;
  cantidad: number;
  total: number;
}

export interface ProveedorAggregate {
  proveedor: string;
  label: string;
  cantidad: number;
  total: number;
  porcentaje: number;
}

export interface DashboardAnalytics {
  filters: DashboardFilterParams;
  periodLabel: string;
  totalFacturas: number;
  totalMonto: number;
  promedioFactura: number;
  facturas: Factura[];
  porMes: MesAggregate[];
  porProveedor: ProveedorAggregate[];
  añosDisponibles: number[];
  proveedores: string[];
}

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export function currentDashboardFilters(): DashboardFilterParams {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    proveedor: null,
  };
}

export function parseDashboardQuery(searchParams: URLSearchParams): DashboardFilterParams {
  const defaults = currentDashboardFilters();
  const year = Number(searchParams.get("year")) || defaults.year;
  const monthParam = searchParams.get("month");
  const month =
    monthParam === "all" || monthParam === "" || monthParam === null
      ? null
      : Number(monthParam) || defaults.month;
  const proveedor = searchParams.get("proveedor") || null;

  return { year, month, proveedor: proveedor === "all" ? null : proveedor };
}

export function getEmisionParts(factura: Factura) {
  const date = parseEmisionDate(factura.fecha_emision);
  if (!date) return null;
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function matchesPeriod(factura: Factura, filters: DashboardFilterParams) {
  const parts = getEmisionParts(factura);
  if (!parts) return false;
  if (parts.year !== filters.year) return false;
  if (filters.month != null && parts.month !== filters.month) return false;
  return true;
}

function matchesProveedor(factura: Factura, proveedor: string | null) {
  if (!proveedor) return true;
  return factura.proveedor === proveedor;
}

export function filterFacturasForDashboard(
  facturas: Factura[],
  filters: DashboardFilterParams,
): Factura[] {
  return facturas.filter(
    (factura) => matchesPeriod(factura, filters) && matchesProveedor(factura, filters.proveedor),
  );
}

export function filterByYearAndProveedor(
  facturas: Factura[],
  year: number,
  proveedor: string | null,
): Factura[] {
  return facturas.filter((factura) => {
    const parts = getEmisionParts(factura);
    if (!parts || parts.year !== year) return false;
    return matchesProveedor(factura, proveedor);
  });
}

export function computePorMesAggregates(
  facturas: Factura[],
  year: number,
  proveedor: string | null,
): MesAggregate[] {
  const yearFacturas = filterByYearAndProveedor(facturas, year, proveedor);
  return MESES.map((label, index) => {
    const mes = index + 1;
    const mesFacturas = yearFacturas.filter((f) => getEmisionParts(f)?.month === mes);
    return {
      mes,
      label,
      cantidad: mesFacturas.length,
      total: mesFacturas.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0),
    };
  });
}

export function computeProveedorAggregates(facturas: Factura[]): ProveedorAggregate[] {
  const providerTotals = new Map<string, { cantidad: number; total: number }>();
  for (const factura of facturas) {
    const current = providerTotals.get(factura.proveedor) ?? { cantidad: 0, total: 0 };
    providerTotals.set(factura.proveedor, {
      cantidad: current.cantidad + 1,
      total: current.total + (factura.total_pagar ?? 0),
    });
  }

  const periodMonto = facturas.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0);
  return [...providerTotals.entries()]
    .map(([proveedor, data]) => ({
      proveedor,
      label: providerLabel(proveedor),
      cantidad: data.cantidad,
      total: data.total,
      porcentaje: periodMonto > 0 ? (data.total / periodMonto) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

function buildPeriodLabel(filters: DashboardFilterParams) {
  if (filters.month == null) {
    return `Año ${filters.year}`;
  }
  return `${MESES[filters.month - 1]} ${filters.year}`;
}

export function extractAvailableYears(facturas: Factura[]): number[] {
  const years = new Set<number>();
  for (const factura of facturas) {
    const parts = getEmisionParts(factura);
    if (parts) years.add(parts.year);
  }
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  return [...years].sort((a, b) => b - a);
}

export function extractProveedores(facturas: Factura[]): string[] {
  return [...new Set(facturas.map((f) => f.proveedor))].sort();
}

export function computeDashboardAnalytics(
  allFacturas: Factura[],
  filters: DashboardFilterParams,
): DashboardAnalytics {
  const filtered = filterFacturasForDashboard(allFacturas, filters);
  const totalMonto = filtered.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0);
  const totalFacturas = filtered.length;

  const porMes = computePorMesAggregates(allFacturas, filters.year, filters.proveedor).map(
    (m) => ({ ...m, label: m.label.slice(0, 3) }),
  );
  const porProveedor = computeProveedorAggregates(filtered);

  return {
    filters,
    periodLabel: buildPeriodLabel(filters),
    totalFacturas,
    totalMonto,
    promedioFactura: totalFacturas > 0 ? totalMonto / totalFacturas : 0,
    facturas: filtered.sort((a, b) => {
      const da = parseEmisionDate(a.fecha_emision)?.getTime() ?? 0;
      const db = parseEmisionDate(b.fecha_emision)?.getTime() ?? 0;
      return db - da;
    }),
    porMes,
    porProveedor,
    añosDisponibles: extractAvailableYears(allFacturas),
    proveedores: extractProveedores(allFacturas),
  };
}

export function buildDashboardQuery(filters: DashboardFilterParams): string {
  const params = new URLSearchParams();
  params.set("year", String(filters.year));
  params.set("month", filters.month == null ? "all" : String(filters.month));
  params.set("proveedor", filters.proveedor ?? "all");
  return params.toString();
}

export { MESES };
