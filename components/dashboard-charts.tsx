"use client";

import { useState } from "react";
import { Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { MesAggregate, ProveedorAggregate } from "@/lib/dashboard-analytics";

interface MonthlyChartProps {
  data: MesAggregate[];
  selectedMonth: number | null;
  onSelectMonth?: (month: number) => void;
}

export function MonthlyChart({ data, selectedMonth, onSelectMonth }: MonthlyChartProps) {
  const maxTotal = Math.max(...data.map((item) => item.total), 1);
  const [hoveredMes, setHoveredMes] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="chart-grid-bg relative rounded-2xl border border-border/50 bg-muted/20 px-3 pb-2 pt-8 sm:px-4">
        <div className="pointer-events-none absolute inset-x-4 top-8 bottom-14 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-dashed border-border/50" />
          ))}
        </div>

        <div className="relative flex h-52 items-end gap-1.5 sm:gap-2.5">
          {data.map((item) => {
            const height = item.total > 0 ? Math.max((item.total / maxTotal) * 100, 10) : 6;
            const isSelected = selectedMonth === item.mes;
            const isHovered = hoveredMes === item.mes;
            const isActive = selectedMonth == null || isSelected;
            const showValue = isSelected || isHovered;

            return (
              <button
                key={item.mes}
                type="button"
                title={`${item.label}: ${formatCurrency(item.total)} (${item.cantidad} facturas)`}
                disabled={!onSelectMonth}
                onMouseEnter={() => setHoveredMes(item.mes)}
                onMouseLeave={() => setHoveredMes(null)}
                onClick={() => onSelectMonth?.(item.mes)}
                className={cn(
                  "group flex flex-1 flex-col items-center gap-2 transition-all duration-300",
                  onSelectMonth && "cursor-pointer",
                  !isActive && "opacity-40",
                )}
              >
                <div className="relative flex h-44 w-full flex-col items-center justify-end">
                  {showValue && item.total > 0 ? (
                    <span className="mb-2 rounded-lg bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-md sm:text-xs">
                      {formatCurrency(item.total)}
                    </span>
                  ) : (
                    <span className="mb-2 h-5" aria-hidden />
                  )}
                  <div
                    className={cn(
                      "w-full max-w-[2.75rem] rounded-t-xl transition-all duration-300 sm:max-w-[3.25rem]",
                      isSelected
                        ? "bg-gradient-to-t from-primary via-[#6B6AE8] to-[#9B9AF5] shadow-lg shadow-primary/25"
                        : "bg-primary/20 group-hover:bg-primary/45",
                      isHovered && !isSelected && "scale-y-[1.02] bg-primary/50",
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide sm:text-xs",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Monto por mes · Clic en una barra para filtrar el periodo
      </p>
    </div>
  );
}

const providerGradients = [
  "from-primary to-[#8C8BEF]",
  "from-sky-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-amber-500 to-orange-400",
];

interface ProviderChartProps {
  data: ProveedorAggregate[];
}

export function ProviderChart({ data }: ProviderChartProps) {
  const maxTotal = Math.max(...data.map((item) => item.total), 1);

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
        <Building2 className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">
          Sin datos de proveedores para este periodo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const width = item.total > 0 ? Math.max((item.total / maxTotal) * 100, 8) : 0;
        const gradient = providerGradients[index % providerGradients.length];
        const initials = item.label
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();

        return (
          <div
            key={item.proveedor}
            className="surface-card group p-5 transition-all duration-200 hover:border-primary/25 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-extrabold text-white shadow-md",
                  gradient,
                )}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      {item.label}
                    </h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.cantidad} factura{item.cantidad !== 1 ? "s" : ""} en el periodo
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                      {formatCurrency(item.total)}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-xs font-semibold text-primary">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {item.porcentaje.toFixed(0)}% del total
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted/80 p-px">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
                      gradient,
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
