import * as XLSX from "xlsx";
import type { ReportResult } from "./types";

function rowsToSheetData(report: ReportResult): Record<string, string | number | null>[] {
  return report.rows.map((row) => {
    const out: Record<string, string | number | null> = {};
    for (const col of report.columns) {
      out[col.label] = row[col.key] ?? "";
    }
    return out;
  });
}

export function reportToExcelBuffer(report: ReportResult): Buffer {
  const sheetData = rowsToSheetData(report);

  if (report.footer) {
    const footerRow: Record<string, string | number | null> = {};
    for (const col of report.columns) {
      footerRow[col.label] = report.footer[col.key] ?? "";
    }
    sheetData.push(footerRow);
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  const sheetName = report.title.slice(0, 31);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
