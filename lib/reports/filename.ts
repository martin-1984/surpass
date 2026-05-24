import type { ReportExportFormat, ReportType } from "./types";

export function buildReportFilename(
  type: ReportType,
  format: ReportExportFormat,
  date = new Date(),
): string {
  const stamp = date.toISOString().slice(0, 10);
  const ext =
    format === "xlsx"
      ? "xlsx"
      : format === "csv"
        ? "csv"
        : format === "pdf"
          ? "pdf"
          : "json";
  return `reporte_${type}_${stamp}.${ext}`;
}
