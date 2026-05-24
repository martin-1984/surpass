"use client";

import { useMemo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/glass-card";
import { buildReportPeriodLabel, defaultReportFilters } from "@/lib/reports/filters";
import type { ReportFilters } from "@/lib/reports/types";
import type { ReportType } from "@/lib/reports/types";
import { providerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ReportFiltersPanelProps {
  filters: ReportFilters;
  reportType: ReportType;
  proveedores: string[];
  añosDisponibles: number[];
  isLoading?: boolean;
  onChange: (filters: ReportFilters) => void;
}

export function ReportFiltersPanel({
  filters,
  reportType,
  proveedores,
  añosDisponibles,
  isLoading,
  onChange,
}: ReportFiltersPanelProps) {
  function update(partial: Partial<ReportFilters>) {
    onChange({ ...filters, ...partial, uploadedToday: false });
  }

  const periodLabel = buildReportPeriodLabel(filters);
  const showYearFilter = reportType === "por_mes";

  const fieldLabelClass =
    "text-xs font-bold tracking-wider text-muted-foreground uppercase";
  const controlClass =
    "!h-11 !min-h-11 w-full rounded-xl border-border/80 bg-background/40 py-2 transition-all hover:bg-background/60 focus:bg-background/80";

  const proveedorItems = useMemo(
    () => [
      { value: "all", label: "Todos los proveedores" },
      ...proveedores.map((proveedor) => ({
        value: proveedor,
        label: providerLabel(proveedor),
      })),
    ],
    [proveedores],
  );

  return (
    <GlassCard padding="md">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary">
              <Filter className="h-4 w-4" />
              Filtros del reporte
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onChange({ ...defaultReportFilters(), uploadedToday: false })}
            >
              Restablecer
            </Button>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{periodLabel}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        {showYearFilter ? (
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="report-filter-year" className={fieldLabelClass}>
              Año
            </Label>
            <Select
              value={String(filters.year ?? new Date().getFullYear())}
              onValueChange={(value) => update({ year: Number(value) })}
              disabled={isLoading}
            >
              <SelectTrigger id="report-filter-year" className={controlClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {añosDisponibles.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="report-filter-emision-desde" className={fieldLabelClass}>
                Emisión desde
              </Label>
              <DatePicker
                id="report-filter-emision-desde"
                value={filters.emisionDesde}
                onChange={(value) => update({ emisionDesde: value })}
                disabled={isLoading || filters.uploadedToday}
                className={controlClass}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="report-filter-emision-hasta" className={fieldLabelClass}>
                Emisión hasta
              </Label>
              <DatePicker
                id="report-filter-emision-hasta"
                value={filters.emisionHasta}
                onChange={(value) => update({ emisionHasta: value })}
                disabled={isLoading || filters.uploadedToday}
                className={controlClass}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="report-filter-proveedor" className={fieldLabelClass}>
            Proveedor
          </Label>
          <Select
            items={proveedorItems}
            value={filters.proveedor ?? "all"}
            onValueChange={(value) =>
              update({ proveedor: value === "all" ? null : value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="report-filter-proveedor" className={controlClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todos los proveedores</SelectItem>
              {proveedores.map((proveedor) => (
                <SelectItem key={proveedor} value={proveedor}>
                  {providerLabel(proveedor)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!showYearFilter ? (
          <div className="flex flex-col gap-2.5">
            <Label className={cn(fieldLabelClass, "invisible select-none")} aria-hidden>
              Acción
            </Label>
            <Button
              type="button"
              variant="outline"
              className={cn(controlClass, "font-semibold")}
              disabled={isLoading}
              onClick={() =>
                onChange({
                  ...filters,
                  uploadedToday: true,
                  emisionDesde: undefined,
                  emisionHasta: undefined,
                })
              }
            >
              Solo subidas hoy
            </Button>
          </div>
        ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
