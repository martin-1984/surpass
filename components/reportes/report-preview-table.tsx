"use client";

import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReportPagination } from "@/components/reportes/report-pagination";
import type { ReportPaginationMeta } from "@/lib/reports/paginate";
import type { ReportResult } from "@/lib/reports/types";

interface ReportPreviewTableProps {
  report: ReportResult;
  pagination: ReportPaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export function ReportPreviewTable({
  report,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: ReportPreviewTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg font-bold">{report.title}</h3>
          <p className="text-sm text-muted-foreground">{report.periodLabel}</p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {pagination.totalRows} fila{pagination.totalRows !== 1 ? "s" : ""} en total
        </p>
      </div>

      <div className="relative">
        {isLoading ? (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/50 backdrop-blur-[1px]"
            aria-hidden
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}

        <div
          className={cn(
            "overflow-x-auto rounded-2xl border border-border/80 transition-opacity duration-150",
            isLoading && "opacity-60",
          )}
        >
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

      <ReportPagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        disabled={isLoading}
      />
    </div>
  );
}
