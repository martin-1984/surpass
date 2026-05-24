import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import type { Factura } from "@/lib/types/database";
import { buildReportPeriodLabel } from "../filters";
import type { ReportFilters, ReportResult } from "../types";

export function generateFacturasReport(
  facturas: Factura[],
  filters: ReportFilters,
): ReportResult {
  const periodLabel = buildReportPeriodLabel(filters);

  const columns = [
    { key: "numero", label: "N° Factura" },
    { key: "proveedor", label: "Proveedor" },
    { key: "emision", label: "Emisión" },
    { key: "vencimiento", label: "Vencimiento" },
    { key: "ruc", label: "RUC emisor" },
    { key: "total", label: "Total" },
    { key: "estado", label: "Estado" },
  ];

  const rows = facturas.map((f) => ({
    numero: f.numero_factura,
    proveedor: providerLabel(f.proveedor),
    emision: formatDate(f.fecha_emision),
    vencimiento: formatDate(f.fecha_vencimiento),
    ruc: f.ruc_emisor ?? "—",
    total: formatCurrency(f.total_pagar, f.moneda),
    estado: f.estado === "parsed" ? "Procesada" : "Pendiente",
  }));

  const totalMonto = facturas.reduce((sum, f) => sum + (f.total_pagar ?? 0), 0);

  return {
    type: "facturas",
    title: "Listado de facturas",
    periodLabel,
    columns,
    rows,
    footer: {
      numero: "Total",
      proveedor: "",
      emision: "",
      vencimiento: "",
      ruc: "",
      total: formatCurrency(totalMonto),
      estado: `${facturas.length} factura(s)`,
    },
    totalRows: rows.length,
  };
}
