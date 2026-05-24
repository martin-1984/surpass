"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPORT_PAGE_SIZE_OPTIONS,
  type ReportPaginationMeta,
} from "@/lib/reports/paginate";
import { cn } from "@/lib/utils";

interface ReportPaginationProps {
  pagination: ReportPaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
  className?: string;
}

export function ReportPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  disabled,
  className,
}: ReportPaginationProps) {
  const { page, pageSize, totalRows, totalPages } = pagination;

  if (totalRows === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalRows);
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        de <span className="font-medium text-foreground">{totalRows}</span> filas
      </p>

      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Filas por página</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger
              size="sm"
              className="h-9 w-[76px] border-border bg-background/40"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {REPORT_PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm font-medium">
          Página {page} de {totalPages}
        </p>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="hidden border-border bg-background/40 sm:inline-flex"
            onClick={() => onPageChange(1)}
            disabled={disabled || !canPrevious}
          >
            <span className="sr-only">Primera página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-border bg-background/40"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled || !canPrevious}
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-border bg-background/40"
            onClick={() => onPageChange(page + 1)}
            disabled={disabled || !canNext}
          >
            <span className="sr-only">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="hidden border-border bg-background/40 sm:inline-flex"
            onClick={() => onPageChange(totalPages)}
            disabled={disabled || !canNext}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
