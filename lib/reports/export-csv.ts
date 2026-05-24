import type { ReportResult } from "./types";

const SEPARATOR = ";";

function escapeCsvCell(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(SEPARATOR) || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsvLine(
  report: ReportResult,
  values: Record<string, string | number | null | undefined>,
): string {
  return report.columns
    .map((col) => escapeCsvCell(values[col.key]))
    .join(SEPARATOR);
}

export function reportToCsvString(report: ReportResult): string {
  const lines: string[] = [];
  lines.push(report.columns.map((c) => escapeCsvCell(c.label)).join(SEPARATOR));

  for (const row of report.rows) {
    lines.push(rowToCsvLine(report, row));
  }

  if (report.footer) {
    lines.push(rowToCsvLine(report, report.footer));
  }

  return `\uFEFF${lines.join("\r\n")}`;
}

export function reportToCsvBuffer(report: ReportResult): Buffer {
  return Buffer.from(reportToCsvString(report), "utf-8");
}
