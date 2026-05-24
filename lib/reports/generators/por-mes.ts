import { computePorMesAggregates } from "@/lib/dashboard-analytics";
import { formatCurrency } from "@/lib/format";
import type { Factura } from "@/lib/types/database";
import type { ReportFilters, ReportResult } from "../types";

export function generatePorMesReport(
  allFacturas: Factura[],
  filters: ReportFilters,
): ReportResult {
  const year = filters.year ?? new Date().getFullYear();
  const aggregates = computePorMesAggregates(
    allFacturas,
    year,
    filters.proveedor ?? null,
  );
  const periodLabel = `Año ${year}${filters.proveedor ? ` · proveedor filtrado` : ""}`;

  const columns = [
    { key: "mes", label: "Mes" },
    { key: "cantidad", label: "Facturas" },
    { key: "total", label: "Monto total" },
  ];

  const rows = aggregates
    .filter((m) => m.cantidad > 0)
    .map((m) => ({
      mes: m.label,
      cantidad: m.cantidad,
      total: formatCurrency(m.total),
    }));

  const totalMonto = aggregates.reduce((sum, m) => sum + m.total, 0);
  const totalCantidad = aggregates.reduce((sum, m) => sum + m.cantidad, 0);

  return {
    type: "por_mes",
    title: "Por mes",
    periodLabel,
    columns,
    rows,
    footer: {
      mes: "Total año",
      cantidad: totalCantidad,
      total: formatCurrency(totalMonto),
    },
    totalRows: rows.length,
  };
}
