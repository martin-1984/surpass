"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportResult } from "@/lib/reports/types";

interface ReportPreviewTableProps {
  report: ReportResult;
  truncated?: boolean;
  totalRows?: number;
}

export function ReportPreviewTable({
  report,
  truncated,
  totalRows,
}: ReportPreviewTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg font-bold">{report.title}</h3>
          <p className="text-sm text-muted-foreground">{report.periodLabel}</p>
        </div>
        {totalRows != null ? (
          <p className="text-sm font-medium text-muted-foreground">
            {totalRows} fila{totalRows !== 1 ? "s" : ""}
            {truncated ? " (vista previa limitada)" : ""}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              {report.columns.map((col) => (
                <TableHead key={col.key} className="whitespace-nowrap font-bold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={report.columns.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  Sin datos para los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              report.rows.map((row, index) => (
                <TableRow key={index}>
                  {report.columns.map((col) => (
                    <TableCell key={col.key} className="max-w-xs truncate">
                      {row[col.key] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {report.footer && report.rows.length > 0 ? (
              <TableRow className="bg-muted/40 font-semibold">
                {report.columns.map((col) => (
                  <TableCell key={col.key}>{report.footer![col.key] ?? ""}</TableCell>
                ))}
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
