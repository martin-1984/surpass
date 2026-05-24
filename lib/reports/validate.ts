import { REPORT_TYPES, type ReportExportFormat, type ReportType } from "./types";

export function isReportType(value: string | null): value is ReportType {
  return value != null && (REPORT_TYPES as readonly string[]).includes(value);
}

export function isReportExportFormat(
  value: string | null,
): value is ReportExportFormat {
  return value === "json" || value === "xlsx" || value === "csv" || value === "pdf";
}
