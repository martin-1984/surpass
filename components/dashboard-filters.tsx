"use client";

import { useMemo } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/glass-card";
import {
  currentDashboardFilters,
  MESES,
  type DashboardFilterParams,
} from "@/lib/dashboard-analytics";
import { providerLabel } from "@/lib/format";

interface DashboardFiltersProps {
  filters: DashboardFilterParams;
  añosDisponibles: number[];
  proveedores: string[];
  periodLabel: string;
  isLoading?: boolean;
  onChange: (filters: DashboardFilterParams) => void;
}

export function DashboardFilters({
  filters,
  añosDisponibles,
  proveedores,
  periodLabel,
  isLoading,
  onChange,
}: DashboardFiltersProps) {
  function update(partial: Partial<DashboardFilterParams>) {
    onChange({ ...filters, ...partial });
  }

  function resetFilters() {
    onChange(currentDashboardFilters());
  }

  const mesItems = useMemo(
    () => [
      { value: "all", label: "Todos los meses" },
      ...MESES.map((mes, index) => ({
        value: String(index + 1),
        label: mes,
      })),
    ],
    [],
  );

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
    <GlassCard className="space-y-6" padding="md">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-sm font-bold tracking-wide text-primary">
            <Filter className="h-4.5 w-4.5 shrink-0" />
            <span>Filtros analíticos</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-border/80 bg-background/30 font-semibold transition-all duration-300 hover:bg-background/70 group/btn"
            disabled={isLoading}
            onClick={resetFilters}
          >
            <RotateCcw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover/btn:-rotate-180" />
            Mes actual
          </Button>
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-2.5">
          Segmenta por periodo y proveedor · {periodLabel}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2.5">
          <Label htmlFor="filter-year" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Año</Label>
          <Select
            value={String(filters.year)}
            onValueChange={(value) => update({ year: Number(value) })}
            disabled={isLoading}
          >
            <SelectTrigger id="filter-year" className="h-11 w-full border-border/80 bg-background/40 hover:bg-background/60 focus:bg-background/80 transition-all rounded-xl">
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

        <div className="space-y-2.5">
          <Label htmlFor="filter-month" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Mes</Label>
          <Select
            items={mesItems}
            value={filters.month == null ? "all" : String(filters.month)}
            onValueChange={(value) =>
              update({ month: value === "all" ? null : Number(value) })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="filter-month" className="h-11 w-full border-border/80 bg-background/40 hover:bg-background/60 focus:bg-background/80 transition-all rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todos los meses</SelectItem>
              {MESES.map((mes, index) => (
                <SelectItem key={mes} value={String(index + 1)}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="filter-proveedor" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Proveedor</Label>
          <Select
            items={proveedorItems}
            value={filters.proveedor ?? "all"}
            onValueChange={(value) =>
              update({ proveedor: value === "all" ? null : value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="filter-proveedor" className="h-11 w-full border-border/80 bg-background/40 hover:bg-background/60 focus:bg-background/80 transition-all rounded-xl">
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
      </div>
    </GlassCard>
  );
}
