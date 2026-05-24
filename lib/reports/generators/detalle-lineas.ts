import { providerLabel } from "@/lib/format";
import type { FacturaWithItems } from "@/lib/types/database";
import { buildReportPeriodLabel } from "../filters";
import type { ReportFilters, ReportResult } from "../types";

export function generateDetalleLineasReport(
  facturas: FacturaWithItems[],
  filters: ReportFilters,
): ReportResult {
  const periodLabel = buildReportPeriodLabel(filters);

  const columns = [
    { key: "numero", label: "N° Factura" },
    { key: "proveedor", label: "Proveedor" },
    { key: "emision", label: "Fecha emisión" },
    { key: "item", label: "Item" },
    { key: "cantidad", label: "Cantidad" },
    { key: "unidad", label: "Unidad" },
    { key: "codigo", label: "Código" },
    { key: "descripcion", label: "Descripción" },
    { key: "valorUnitario", label: "Valor unitario" },
    { key: "descuento", label: "Descuento" },
    { key: "precioUnitario", label: "Precio unitario" },
    { key: "total", label: "Total línea" },
  ];

  const rows: ReportResult["rows"] = [];

  for (const factura of facturas) {
    for (const item of factura.factura_items) {
      rows.push({
        numero: factura.numero_factura,
        proveedor: providerLabel(factura.proveedor),
        emision: factura.fecha_emision ?? "",
        item: item.item,
        cantidad: item.cantidad,
        unidad: item.unidad,
        codigo: item.codigo,
        descripcion: item.descripcion,
        valorUnitario: item.valor_unitario,
        descuento: item.descuento,
        precioUnitario: item.precio_unitario,
        total: item.valor_venta,
      });
    }
  }

  const lineTotal = rows.reduce(
    (sum, r) => sum + (typeof r.total === "number" ? r.total : 0),
    0,
  );

  return {
    type: "detalle_lineas",
    title: "Detalle por línea",
    periodLabel,
    columns,
    rows,
    footer: {
      numero: "Total líneas",
      proveedor: "",
      emision: "",
      item: "",
      cantidad: rows.length,
      unidad: "",
      codigo: "",
      descripcion: "",
      valorUnitario: "",
      descuento: "",
      precioUnitario: "",
      total: lineTotal,
    },
    totalRows: rows.length,
  };
}
