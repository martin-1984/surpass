import {
  currentDashboardFilters,
  filterByYearAndProveedor,
} from "@/lib/dashboard-analytics";
import { todayInputDate, toInputDate } from "@/lib/date-emision";
import { filterFacturas, type FacturasFilterParams } from "@/lib/facturas-filter";
import type { Factura } from "@/lib/types/database";
import type { ReportFilters, ReportType } from "./types";

export function defaultReportFilters(): ReportFilters {
  const now = new Date();
  const dash = currentDashboardFilters();
  const startOfMonth = toInputDate(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  return {
    emisionDesde: startOfMonth,
    emisionHasta: todayInputDate(),
    proveedor: null,
    year: dash.year,
  };
}

export function parseReportQuery(searchParams: URLSearchParams): {
  filters: ReportFilters;
  type: ReportType | null;
  format: string;
} {
  const typeParam = searchParams.get("type");
  const format = searchParams.get("format") ?? "json";

  const defaults = defaultReportFilters();
  const emisionDesde = searchParams.get("emisionDesde") ?? defaults.emisionDesde;
  const emisionHasta = searchParams.get("emisionHasta") ?? defaults.emisionHasta;
  const proveedorParam = searchParams.get("proveedor");
  const proveedor =
    proveedorParam === "all" || !proveedorParam ? null : proveedorParam;
  const uploadedToday = searchParams.get("uploadedToday") === "true";
  const year = Number(searchParams.get("year")) || defaults.year;

  const filters: ReportFilters = {
    emisionDesde,
    emisionHasta,
    proveedor,
    uploadedToday,
    year,
  };

  return {
    filters,
    type: typeParam as ReportType | null,
    format,
  };
}

export function buildReportPeriodLabel(filters: ReportFilters): string {
  if (filters.uploadedToday) {
    return "Subidas hoy";
  }
  if (filters.emisionDesde && filters.emisionHasta) {
    const fmt = (iso: string) => iso.split("-").reverse().join("/");
    return `Emisión ${fmt(filters.emisionDesde)} – ${fmt(filters.emisionHasta)}`;
  }
  if (filters.year) {
    return `Año ${filters.year}`;
  }
  return "Sin filtro";
}

export function filterFacturasForReport(
  facturas: Factura[],
  filters: ReportFilters,
): Factura[] {
  const params: FacturasFilterParams = {};

  if (filters.uploadedToday) {
    params.uploadedToday = true;
  } else if (filters.emisionDesde && filters.emisionHasta) {
    params.emisionDesde = filters.emisionDesde;
    params.emisionHasta = filters.emisionHasta;
  }

  let result = filterFacturas(facturas, params);

  if (filters.proveedor) {
    result = result.filter((f) => f.proveedor === filters.proveedor);
  }

  return result;
}

export function filterFacturasForPorMes(
  facturas: Factura[],
  filters: ReportFilters,
): Factura[] {
  const year = filters.year ?? new Date().getFullYear();
  return filterByYearAndProveedor(facturas, year, filters.proveedor ?? null);
}

export function buildReportQuery(
  type: ReportType,
  filters: ReportFilters,
): string {
  const params = new URLSearchParams();
  params.set("type", type);
  if (filters.uploadedToday) {
    params.set("uploadedToday", "true");
  } else {
    if (filters.emisionDesde) params.set("emisionDesde", filters.emisionDesde);
    if (filters.emisionHasta) params.set("emisionHasta", filters.emisionHasta);
  }
  if (filters.proveedor) params.set("proveedor", filters.proveedor);
  if (filters.year) params.set("year", String(filters.year));
  return params.toString();
}
