"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Building2, Calendar, Hash, Receipt } from "lucide-react";
import { DeleteFacturaButton } from "@/components/delete-factura-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { getFacturaItemColumns } from "@/components/factura-items/columns";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FacturaItem, FacturaWithItems } from "@/lib/types/database";

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
    <div className="surface-card flex items-center gap-4 p-5 transition-all duration-200 hover:border-primary/25 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/12">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 space-y-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          {label}
        </span>
        <p className="font-bold text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}

function FacturaItemsMobileCards({
  items,
  moneda,
}: {
  items: FacturaItem[];
  moneda: string;
}) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-sm hover:border-primary/15 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">Item {item.item}</span>
            <span className="shrink-0 font-bold text-primary">
              {formatCurrency(item.valor_venta, moneda)}
            </span>
          </div>
          <p className="text-sm font-semibold leading-snug text-foreground/90">{item.descripcion}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground/95 bg-muted/40 p-2.5 rounded-xl border border-border/40">
            <span className="truncate">Cód: <span className="font-medium text-foreground/80">{item.codigo}</span></span>
            <span className="text-right">
              Cant: <span className="font-medium text-foreground/80">{item.cantidad} {item.unidad}</span>
            </span>
            <span>V.U: <span className="font-medium text-foreground/80">{formatCurrency(item.valor_unitario, moneda)}</span></span>
            <span className="text-right">
              Dscto: <span className="font-medium text-foreground/80">{formatCurrency(item.descuento, moneda)}</span>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

export function FacturaDetail({
  factura,
  returnHref = "/facturas?uploadedToday=true",
}: {
  factura: FacturaWithItems;
  returnHref?: string;
}) {
  const columns = useMemo(
    () => getFacturaItemColumns(factura.moneda),
    [factura.moneda],
  );

  const desktopHeader = (
    <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4.5 bg-card/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10">
        <Building2 className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-heading text-sm font-bold tracking-tight text-foreground/90">Detalle de líneas</h2>
        <p className="text-xs text-muted-foreground/80">
          {factura.factura_items.length} línea{factura.factura_items.length !== 1 ? "s" : ""} de detalle
        </p>
      </div>
    </div>
  );

  const mobileHeader = (
    <h2 className="font-heading text-lg font-bold text-foreground/90 lg:hidden">
      Detalle ({factura.factura_items.length} ítems)
    </h2>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <Link
        href={returnHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "inline-flex w-fit text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 hover:bg-muted/60 font-medium",
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Volver al historial
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {factura.numero_factura}
            </h1>
            <Badge className="rounded-full border-primary/10 bg-primary/8 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/12">
              {providerLabel(factura.proveedor)}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-border bg-background/50 px-3 py-1 text-xs font-semibold text-foreground/80"
            >
              {factura.estado === "parsed" ? "Procesada" : "Pendiente"}
            </Badge>
          </div>
          <p className="truncate text-sm font-medium text-muted-foreground/80">
            Archivo: {factura.archivo_nombre}
          </p>
        </div>
        <DeleteFacturaButton
          facturaId={factura.id}
          label={factura.numero_factura}
          returnHref={returnHref}
          className="shrink-0 self-start"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <DataTable
        columns={columns}
        data={factura.factura_items}
        resetKey={factura.id}
        wide
        mobileHeader={mobileHeader}
        mobileRenderer={(items) => (
          <FacturaItemsMobileCards items={items} moneda={factura.moneda} />
        )}
        desktopHeader={desktopHeader}
        desktopContainerClassName="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg shadow-black/5"
        className="[&_.table-scroll]:mx-4 [&_.table-scroll]:mb-4 sm:[&_.table-scroll]:mx-6 sm:[&_.table-scroll]:mb-6 [&_.table-scroll]:border-0"
      />
    </div>
  );
}
