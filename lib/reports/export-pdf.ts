import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportResult } from "./types";
import { PDF_ROW_LIMIT } from "./types";

export function reportToPdfBuffer(report: ReportResult): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.text(report.title, 14, 16);
  doc.setFontSize(10);
  doc.text(report.periodLabel, 14, 23);
  doc.text(`Generado: ${new Date().toLocaleString("es-PE")}`, 14, 29);

  const rows = report.rows.slice(0, PDF_ROW_LIMIT);
  const head = [report.columns.map((c) => c.label)];
  const body = rows.map((row) =>
    report.columns.map((col) => {
      const v = row[col.key];
      return v == null ? "" : String(v);
    }),
  );

  if (report.footer) {
    body.push(
      report.columns.map((col) => {
        const v = report.footer![col.key];
        return v == null ? "" : String(v);
      }),
    );
  }

  autoTable(doc, {
    head,
    body,
    startY: 34,
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 14, right: 14 },
  });

  if (report.totalRows > PDF_ROW_LIMIT) {
    const finalY =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 200;
    doc.setFontSize(8);
    doc.text(
      `Mostrando ${PDF_ROW_LIMIT} de ${report.totalRows} filas. Exporte Excel para el detalle completo.`,
      14,
      finalY + 8,
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
