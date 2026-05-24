import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DeleteFacturaButton } from "@/components/delete-factura-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Factura } from "@/lib/types/database";

interface InvoiceMobileListProps {
  facturas: Factura[];
  showEstado?: boolean;
  listQuery?: string;
  onDeleted?: (id: string) => void;
}

export function InvoiceMobileList({
  facturas,
  showEstado = false,
  listQuery = "",
  onDeleted,
}: InvoiceMobileListProps) {
  return (
    <div className="grid gap-3.5 lg:hidden">
      {facturas.map((factura) => (
        <div
          key={factura.id}
          className="group flex items-center gap-2 rounded-2xl border border-border/80 border-l-4 border-l-primary/30 bg-card/70 p-3 pl-4 shadow-sm transition-all duration-300 hover:border-primary/15 hover:border-l-primary hover:bg-card animate-fade-in sm:gap-3 sm:p-4 sm:pl-5"
        >
          <Link
            href={`/facturas/${factura.id}${listQuery}`}
            className="flex min-w-0 flex-1 items-center gap-3 transition-transform duration-300 active:scale-[0.99] hover:-translate-y-0.5"
          >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="truncate font-bold text-foreground text-sm tracking-tight" title={factura.numero_factura}>
                {factura.numero_factura}
              </span>
              {showEstado ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border-0",
                    factura.estado === "parsed"
                      ? "bg-primary/8 text-primary"
                      : "bg-muted/80 text-muted-foreground",
                  )}
                >
                  {factura.estado === "parsed" ? "Procesada" : "Pendiente"}
                </Badge>
              ) : null}
            </div>
            <p className="truncate text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider" title={providerLabel(factura.proveedor)}>
              {providerLabel(factura.proveedor)}
            </p>
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="shrink-0 font-medium text-muted-foreground/80">
                {formatDate(factura.fecha_emision)}
              </span>
              <span className="truncate font-extrabold text-primary">
                {formatCurrency(factura.total_pagar, factura.moneda)}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
          <DeleteFacturaButton
            facturaId={factura.id}
            label={factura.numero_factura}
            iconOnly
            onDeleted={() => onDeleted?.(factura.id)}
            className="shrink-0"
          />
        </div>
      ))}
    </div>
  );
}
