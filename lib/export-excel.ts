import * as XLSX from "xlsx";
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

export function facturasToExcelBuffer(facturas: FacturaWithItems[]): Buffer {
  const rows = buildExportRows(facturas);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle facturas");
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
