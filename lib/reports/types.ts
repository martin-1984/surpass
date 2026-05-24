export const REPORT_TYPES = [
  "resumen",
  "por_proveedor",
  "por_mes",
  "facturas",
  "detalle_lineas",
  "top_productos",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export type ReportExportFormat = "json" | "xlsx" | "csv" | "pdf";

export interface ReportFilters {
  emisionDesde?: string;
  emisionHasta?: string;
  proveedor?: string | null;
  uploadedToday?: boolean;
  year?: number;
}

export interface ReportColumn {
  key: string;
  label: string;
}

export type ReportRow = Record<string, string | number | null>;

export interface ReportResult {
  type: ReportType;
  title: string;
  periodLabel: string;
  columns: ReportColumn[];
  rows: ReportRow[];
  footer?: ReportRow;
  totalRows: number;
}

export const REPORT_META: Record<
  ReportType,
  { title: string; description: string; needsItems: boolean }
> = {
  resumen: {
    title: "Resumen del periodo",
    description: "Totales de facturas, monto y promedio en el rango seleccionado.",
    needsItems: false,
  },
  por_proveedor: {
    title: "Por proveedor",
    description: "Cantidad y monto agrupados por proveedor con participación %.",
    needsItems: false,
  },
  por_mes: {
    title: "Por mes",
    description: "Desglose mensual del año seleccionado.",
    needsItems: false,
  },
  facturas: {
    title: "Listado de facturas",
    description: "Cabecera de cada factura: número, fechas, RUC y total.",
    needsItems: false,
  },
  detalle_lineas: {
    title: "Detalle por línea",
    description: "Cada ítem de factura con cantidades, códigos y montos.",
    needsItems: true,
  },
  top_productos: {
    title: "Top productos",
    description: "Productos más comprados por código (cantidad y monto).",
    needsItems: true,
  },
};

export const PDF_ROW_LIMIT = 500;
