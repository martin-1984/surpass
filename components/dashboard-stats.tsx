"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BarChart3, CalendarRange, FileText, PieChart, Receipt, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { MonthlyChart, ProviderChart } from "@/components/dashboard-charts";
import { DashboardFilters } from "@/components/dashboard-filters";
import { EmptyState } from "@/components/empty-state";
import { GlassCard } from "@/components/glass-card";
import { InvoicesDataView } from "@/components/invoices-data-view";
import { LoadingState } from "@/components/loading-state";
import { StatCard } from "@/components/stat-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  buildDashboardQuery,
  type DashboardAnalytics,
  type DashboardFilterParams,
} from "@/lib/dashboard-analytics";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  initialAnalytics: DashboardAnalytics;
}

export function DashboardStats({ initialAnalytics }: DashboardStatsProps) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = useCallback(async (filters: DashboardFilterParams) => {
    setIsLoading(true);
    try {
      const query = buildDashboardQuery(filters);
      const response = await fetch(`/api/dashboard/stats?${query}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo cargar el dashboard");
      }

      setAnalytics(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar el dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleFilterChange(filters: DashboardFilterParams) {
    void loadAnalytics(filters);
  }

  function handleMonthClick(month: number) {
    handleFilterChange({ ...analytics.filters, month });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen de facturas procesadas de Cerámica Lima y Saint-Gobain."
      >
        <Badge
          variant="outline"
          className="h-9 gap-1.5 rounded-xl border-primary/20 bg-primary/5 px-3 text-sm font-semibold text-primary"
        >
          <CalendarRange className="h-4 w-4" />
          {analytics.periodLabel}
        </Badge>
      </PageHeader>

      <DashboardFilters
        filters={analytics.filters}
        añosDisponibles={analytics.añosDisponibles}
        proveedores={analytics.proveedores}
        periodLabel={analytics.periodLabel}
        isLoading={isLoading}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <LoadingState label="Actualizando datos..." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total facturas"
              value={analytics.totalFacturas}
              hint="PDFs procesados en el sistema"
              icon={FileText}
              accent="primary"
            />
            <StatCard
              title="Monto acumulado"
              value={formatCurrency(analytics.totalMonto)}
              hint="Suma de totales a pagar"
              icon={TrendingUp}
              accent="emerald"
            />
            <StatCard
              title="Acceso rápido"
              value={
                <Link
                  href="/facturas"
                  className="font-heading text-xl font-bold text-primary hover:underline sm:text-2xl"
                >
                  Subir factura →
                </Link>
              }
              hint="Carga un nuevo PDF"
              icon={Receipt}
              accent="violet"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard padding="md">
              <CardHeader className="px-0 pb-4 pt-0">
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Evolución mensual
                </CardTitle>
                <CardDescription>Año {analytics.filters.year}</CardDescription>
              </CardHeader>
              <MonthlyChart
                data={analytics.porMes}
                selectedMonth={analytics.filters.month}
                onSelectMonth={handleMonthClick}
              />
            </GlassCard>

            <GlassCard padding="md">
              <CardHeader className="px-0 pb-4 pt-0">
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <PieChart className="h-5 w-5 text-primary" />
                  Por proveedor
                </CardTitle>
                <CardDescription>{analytics.periodLabel}</CardDescription>
              </CardHeader>
              <ProviderChart data={analytics.porProveedor} />
            </GlassCard>
          </div>

          <GlassCard padding="none" className="overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
              <CardTitle className="font-heading text-lg">Detalle del periodo</CardTitle>
              <CardDescription>
                {analytics.totalFacturas} factura{analytics.totalFacturas !== 1 ? "s" : ""} en{" "}
                {analytics.periodLabel.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <div className="p-4 sm:p-6">
              {!analytics.facturas.length ? (
                <EmptyState
                  icon={FileText}
                  title="Sin facturas en este periodo"
                  description="Prueba otro mes, año o proveedor, o sube nuevas facturas."
                >
                  <Link href="/facturas" className={cn(buttonVariants(), "mt-2")}>
                    Ir a Facturas
                  </Link>
                </EmptyState>
              ) : (
                <InvoicesDataView
                  facturas={analytics.facturas}
                  resetKey={buildDashboardQuery(analytics.filters)}
                />
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
