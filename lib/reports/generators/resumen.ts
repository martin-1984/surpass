import { formatCurrency } from "@/lib/format";
import type { Factura } from "@/lib/types/database";
import { buildReportPeriodLabel } from "../filters";
import type { ReportFilters, ReportResult } from "../types";

export function generateResumenReport(
  facturas: Factura[],
  filters: ReportFilters,
): ReportResult {
  const totalMonto = facturas.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0);
  const totalFacturas = facturas.length;
  const periodLabel = buildReportPeriodLabel(filters);

  const columns = [
    { key: "metrica", label: "Métrica" },
    { key: "valor", label: "Valor" },
  ];

  const rows = [
    { metrica: "Periodo", valor: periodLabel },
    { metrica: "Total facturas", valor: totalFacturas },
    { metrica: "Monto acumulado", valor: formatCurrency(totalMonto) },
    {
      metrica: "Promedio por factura",
      valor: totalFacturas > 0 ? formatCurrency(totalMonto / totalFacturas) : "—",
    },
  ];

  return {
    type: "resumen",
    title: "Resumen del periodo",
    periodLabel,
    columns,
    rows,
    totalRows: rows.length,
  };
}
