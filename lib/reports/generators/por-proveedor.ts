import { computeProveedorAggregates } from "@/lib/dashboard-analytics";
import { formatCurrency } from "@/lib/format";
import type { Factura } from "@/lib/types/database";
import { buildReportPeriodLabel } from "../filters";
import type { ReportFilters, ReportResult } from "../types";

export function generatePorProveedorReport(
  facturas: Factura[],
  filters: ReportFilters,
): ReportResult {
  const aggregates = computeProveedorAggregates(facturas);
  const periodLabel = buildReportPeriodLabel(filters);

  const columns = [
    { key: "proveedor", label: "Proveedor" },
    { key: "cantidad", label: "Facturas" },
    { key: "total", label: "Monto total" },
    { key: "porcentaje", label: "% del total" },
  ];

  const rows = aggregates.map((a) => ({
    proveedor: a.label,
    cantidad: a.cantidad,
    total: formatCurrency(a.total),
    porcentaje: `${a.porcentaje.toFixed(1)}%`,
  }));

  const totalMonto = facturas.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0);

  return {
    type: "por_proveedor",
    title: "Por proveedor",
    periodLabel,
    columns,
    rows,
    footer: {
      proveedor: "Total",
      cantidad: facturas.length,
      total: formatCurrency(totalMonto),
      porcentaje: "100%",
    },
    totalRows: rows.length,
  };
}
