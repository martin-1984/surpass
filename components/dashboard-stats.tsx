"use client";

import Link from "next/link";
import { ArrowRight, FileText, Receipt, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { EmptyState } from "@/components/empty-state";
import { InvoiceMobileList } from "@/components/invoice-mobile-list";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Factura } from "@/lib/types/database";

interface DashboardStatsProps {
  totalFacturas: number;
  totalMonto: number;
  facturasRecientes: Factura[];
}

export function DashboardStats({
  totalFacturas,
  totalMonto,
  facturasRecientes,
}: DashboardStatsProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen de facturas procesadas de Cerámica Lima y Saint-Gobain."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total facturas"
          value={totalFacturas}
          hint="PDFs procesados en el sistema"
          icon={FileText}
          accent="cyan"
        />
        <StatCard
          title="Monto acumulado"
          value={formatCurrency(totalMonto)}
          hint="Suma de totales a pagar"
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="Acceso rápido"
          value={
            <Link
              href="/facturas"
              className={cn(
                buttonVariants({ variant: "link" }),
                "h-auto p-0 text-lg text-cyan-400",
              )}
            >
              Subir factura
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          }
          hint="Carga un nuevo PDF"
          icon={Receipt}
          accent="violet"
          className="sm:col-span-2 xl:col-span-1"
        />
      </div>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 className="font-heading text-lg font-semibold">Facturas recientes</h2>
          <p className="text-sm text-muted-foreground">
            Últimas facturas subidas al sistema
          </p>
        </div>
        <div className="p-4 sm:p-6">
          {!facturasRecientes.length ? (
            <EmptyState
              icon={FileText}
              title="Sin facturas aún"
              description="Ve a Facturas para subir tu primer PDF y comenzar."
            >
              <Link
                href="/facturas"
                className={cn(buttonVariants(), "mt-2 bg-gradient-to-r from-cyan-500 to-cyan-600")}
              >
                Ir a Facturas
              </Link>
            </EmptyState>
          ) : (
            <>
              <InvoiceMobileList facturas={facturasRecientes} />
              <div className="table-scroll hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Factura</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturasRecientes.map((factura) => (
                      <TableRow
                        key={factura.id}
                        className="border-white/5 transition-colors hover:bg-white/5"
                      >
                        <TableCell>
                          <Link
                            href={`/facturas/${factura.id}`}
                            className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            {factura.numero_factura}
                          </Link>
                        </TableCell>
                        <TableCell>{providerLabel(factura.proveedor)}</TableCell>
                        <TableCell>{formatDate(factura.fecha_emision)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(factura.total_pagar, factura.moneda)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
