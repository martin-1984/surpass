import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import type { Factura } from "@/lib/types/database";

interface InvoiceMobileListProps {
  facturas: Factura[];
  showEstado?: boolean;
}

export function InvoiceMobileList({
  facturas,
  showEstado = false,
}: InvoiceMobileListProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {facturas.map((factura) => (
        <Link
          key={factura.id}
          href={`/facturas/${factura.id}`}
          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-muted/20 p-4 transition-all hover:border-cyan-500/30 hover:bg-muted/40 active:scale-[0.99]"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">
                {factura.numero_factura}
              </span>
              {showEstado ? (
                <Badge
                  variant={factura.estado === "parsed" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {factura.estado === "parsed" ? "Procesada" : "Pendiente"}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {providerLabel(factura.proveedor)}
            </p>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                {formatDate(factura.fecha_emision)}
              </span>
              <span className="font-medium text-cyan-400">
                {formatCurrency(factura.total_pagar, factura.moneda)}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-400" />
        </Link>
      ))}
    </div>
  );
}
