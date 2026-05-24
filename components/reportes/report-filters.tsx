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
    <GlassCard className="space-y-5" padding="md">
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
      <p className="text-sm text-muted-foreground">{periodLabel}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showYearFilter ? (
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Año</Label>
            <Select
              value={String(filters.year ?? new Date().getFullYear())}
              onValueChange={(value) => update({ year: Number(value) })}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 w-full rounded-xl">
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
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Emisión desde
              </Label>
              <DatePicker
                value={filters.emisionDesde}
                onChange={(value) => update({ emisionDesde: value })}
                disabled={isLoading || filters.uploadedToday}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Emisión hasta
              </Label>
              <DatePicker
                value={filters.emisionHasta}
                onChange={(value) => update({ emisionHasta: value })}
                disabled={isLoading || filters.uploadedToday}
              />
            </div>
          </>
        )}

        <div className="space-y-2.5">
          <Label
            htmlFor="report-filter-proveedor"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
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
            <SelectTrigger
              id="report-filter-proveedor"
              className="h-11 w-full rounded-xl border-border/80 bg-background/40 transition-all hover:bg-background/60 focus:bg-background/80"
            >
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
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl font-semibold"
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
    </GlassCard>
  );
}
