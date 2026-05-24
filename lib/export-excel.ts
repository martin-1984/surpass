import { reportToExcelBuffer } from "@/lib/reports/export-excel";
import { buildReport } from "@/lib/reports/build-report";
import type { ReportFilters } from "@/lib/reports/types";
import { providerLabel } from "@/lib/format";
import type { FacturaWithItems } from "@/lib/types/database";

export interface ExportRow {
  "N° Factura": string;
  Proveedor: string;
  "Fecha emisión": string;
  Item: string;
  Cantidad: number;
  Unidad: string;
  Código: string;
  Descripción: string;
  "Valor unitario": number;
  Descuento: number;
  "Precio unitario": number;
  Total: number;
}

export function buildExportRows(facturas: FacturaWithItems[]): ExportRow[] {
  const rows: ExportRow[] = [];

  for (const factura of facturas) {
    for (const item of factura.factura_items) {
      rows.push({
        "N° Factura": factura.numero_factura,
        Proveedor: providerLabel(factura.proveedor),
        "Fecha emisión": factura.fecha_emision ?? "",
        Item: item.item,
        Cantidad: item.cantidad,
        Unidad: item.unidad,
        Código: item.codigo,
        Descripción: item.descripcion,
        "Valor unitario": item.valor_unitario,
        Descuento: item.descuento,
        "Precio unitario": item.precio_unitario,
        Total: item.valor_venta,
      });
    }
  }

  return rows;
}

export function facturasToExcelBuffer(
  facturas: FacturaWithItems[],
  filters?: ReportFilters,
): Buffer {
  const report = buildReport({
    type: "detalle_lineas",
    filters: filters ?? {},
    facturas,
    facturasWithItems: facturas,
  });
  return reportToExcelBuffer(report);
}
