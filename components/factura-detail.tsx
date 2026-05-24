"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Hash, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FacturaWithItems } from "@/lib/types/database";

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-muted/20 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-cyan-400" />
        {label}
      </div>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function FacturaDetail({ factura }: { factura: FacturaWithItems }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Link
        href="/facturas"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "inline-flex w-fit text-muted-foreground hover:text-foreground",
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al historial
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {factura.numero_factura}
          </h1>
          <Badge className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30">
            {providerLabel(factura.proveedor)}
          </Badge>
          <Badge variant="outline" className="border-white/15">
            {factura.estado === "parsed" ? "Procesada" : "Pendiente"}
          </Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {factura.archivo_nombre}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetaCard
          icon={Calendar}
          label="Emisión"
          value={formatDate(factura.fecha_emision)}
        />
        <MetaCard
          icon={Calendar}
          label="Vencimiento"
          value={formatDate(factura.fecha_vencimiento)}
        />
        <MetaCard
          icon={Hash}
          label="RUC emisor"
          value={factura.ruc_emisor ?? "—"}
        />
        <MetaCard
          icon={Receipt}
          label="Total a pagar"
          value={formatCurrency(factura.total_pagar, factura.moneda)}
        />
      </div>

      {/* Mobile: cards por línea */}
      <div className="space-y-3 md:hidden">
        <h2 className="font-heading text-lg font-semibold">
          Detalle ({factura.factura_items.length} ítems)
        </h2>
        {factura.factura_items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/10 bg-card/40 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Item {item.item}</span>
              <span className="font-semibold text-cyan-400">
                {formatCurrency(item.valor_venta, factura.moneda)}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug">{item.descripcion}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>Cód: {item.codigo}</span>
              <span>
                {item.cantidad} {item.unidad}
              </span>
              <span>V.U: {formatCurrency(item.valor_unitario, factura.moneda)}</span>
              <span>Dscto: {formatCurrency(item.descuento, factura.moneda)}</span>
            </div>
          </div>
        ))}
      </div>

      <GlassCard padding="none" className="hidden overflow-hidden md:block">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 sm:px-6">
          <Building2 className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="font-heading text-lg font-semibold">Detalle de líneas</h2>
            <p className="text-sm text-muted-foreground">
              {factura.factura_items.length} ítem(s) extraídos del PDF
            </p>
          </div>
        </div>
        <div className="table-scroll border-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
                <TableHead>Unid.</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">V. unit.</TableHead>
                <TableHead className="text-right">Dscto</TableHead>
                <TableHead className="text-right">P. unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factura.factura_items.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-white/5 hover:bg-white/5"
                >
                  <TableCell>{item.item}</TableCell>
                  <TableCell className="text-right">{item.cantidad}</TableCell>
                  <TableCell>{item.unidad}</TableCell>
                  <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                  <TableCell className="max-w-[200px]">{item.descripcion}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.valor_unitario, factura.moneda)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.descuento, factura.moneda)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.precio_unitario, factura.moneda)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-cyan-400/90">
                    {formatCurrency(item.valor_venta, factura.moneda)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
}
