import type { Factura, FacturaWithItems } from "@/lib/types/database";
import { filterFacturasForReport } from "./filters";
import { generateDetalleLineasReport } from "./generators/detalle-lineas";
import { generateFacturasReport } from "./generators/facturas";
import { generatePorMesReport } from "./generators/por-mes";
import { generatePorProveedorReport } from "./generators/por-proveedor";
import { generateResumenReport } from "./generators/resumen";
import { generateTopProductosReport } from "./generators/top-productos";
import {
  PREVIEW_ROW_LIMIT,
  REPORT_META,
  type ReportFilters,
  type ReportResult,
  type ReportType,
} from "./types";

export interface BuildReportInput {
  type: ReportType;
  filters: ReportFilters;
  facturas: Factura[];
  facturasWithItems?: FacturaWithItems[];
}

export function reportNeedsItems(type: ReportType): boolean {
  return REPORT_META[type].needsItems;
}

export function buildReport(input: BuildReportInput): ReportResult {
  const { type, filters, facturas, facturasWithItems } = input;
  const filtered = filterFacturasForReport(facturas, filters);

  switch (type) {
    case "resumen":
      return generateResumenReport(filtered, filters);
    case "por_proveedor":
      return generatePorProveedorReport(filtered, filters);
    case "por_mes":
      return generatePorMesReport(facturas, filters);
    case "facturas":
      return generateFacturasReport(filtered, filters);
    case "detalle_lineas": {
      const withItems = filterFacturasWithItems(
        facturasWithItems ?? [],
        filtered.map((f) => f.id),
      );
      return generateDetalleLineasReport(withItems, filters);
    }
    case "top_productos": {
      const withItems = filterFacturasWithItems(
        facturasWithItems ?? [],
        filtered.map((f) => f.id),
      );
      return generateTopProductosReport(withItems, filters);
    }
    default: {
      const _exhaustive: never = type;
      throw new Error(`Tipo de reporte no soportado: ${_exhaustive}`);
    }
  }
}

function filterFacturasWithItems(
  all: FacturaWithItems[],
  ids: string[],
): FacturaWithItems[] {
  const idSet = new Set(ids);
  return all.filter((f) => idSet.has(f.id));
}

export function toPreviewReport(report: ReportResult): ReportResult {
  if (report.rows.length <= PREVIEW_ROW_LIMIT) {
    return report;
  }
  return {
    ...report,
    rows: report.rows.slice(0, PREVIEW_ROW_LIMIT),
    totalRows: report.totalRows,
  };
}
