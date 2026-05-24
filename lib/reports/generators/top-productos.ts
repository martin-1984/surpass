import { formatCurrency } from "@/lib/format";
import type { FacturaWithItems } from "@/lib/types/database";
import { buildReportPeriodLabel } from "../filters";
import type { ReportFilters, ReportResult } from "../types";

export function generateTopProductosReport(
  facturas: FacturaWithItems[],
  filters: ReportFilters,
): ReportResult {
  const periodLabel = buildReportPeriodLabel(filters);

  const byCode = new Map<
    string,
    { codigo: string; descripcion: string; cantidad: number; monto: number }
  >();

  for (const factura of facturas) {
    for (const item of factura.factura_items) {
      const key = item.codigo;
      const current = byCode.get(key) ?? {
        codigo: item.codigo,
        descripcion: item.descripcion,
        cantidad: 0,
        monto: 0,
      };
      byCode.set(key, {
        codigo: item.codigo,
        descripcion: item.descripcion,
        cantidad: current.cantidad + item.cantidad,
        monto: current.monto + item.valor_venta,
      });
    }
  }

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "descripcion", label: "Descripción" },
    { key: "cantidad", label: "Cantidad acumulada" },
    { key: "monto", label: "Monto total" },
  ];

  const rows = [...byCode.values()]
    .sort((a, b) => b.monto - a.monto)
    .map((p) => ({
      codigo: p.codigo,
      descripcion: p.descripcion,
      cantidad: Math.round(p.cantidad * 100) / 100,
      monto: formatCurrency(p.monto),
    }));

  const totalMonto = [...byCode.values()].reduce((sum, p) => sum + p.monto, 0);

  return {
    type: "top_productos",
    title: "Top productos",
    periodLabel,
    columns,
    rows,
    footer: {
      codigo: "Total",
      descripcion: `${rows.length} producto(s)`,
      cantidad: "",
      monto: formatCurrency(totalMonto),
    },
    totalRows: rows.length,
  };
}
