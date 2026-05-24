"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Building2, CalendarDays, FileText, Hash } from "lucide-react";
import { DeleteFacturaButton } from "@/components/delete-factura-button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import { parseEmisionDate } from "@/lib/date-emision";
import { cn } from "@/lib/utils";
import type { Factura } from "@/lib/types/database";

function CellIcon({
  icon: Icon,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function facturaDetailHref(id: string, listQuery: string) {
  return `/facturas/${id}${listQuery}`;
}

export function getInvoiceColumns(
  showEstado = false,
  listQuery = "",
  onDeleted?: (id: string) => void,
): ColumnDef<Factura>[] {
  const columns: ColumnDef<Factura>[] = [
    {
      accessorKey: "numero_factura",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Factura" />
      ),
      cell: ({ row }) => (
        <CellIcon icon={Hash}>
          <Link
            href={facturaDetailHref(row.original.id, listQuery)}
            className="block truncate font-heading text-base font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
            title={row.original.numero_factura}
          >
            {row.original.numero_factura}
          </Link>
        </CellIcon>
      ),
    },
    {
      accessorKey: "proveedor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Proveedor" />
      ),
      cell: ({ row }) => (
        <CellIcon icon={Building2}>
          <span
            className="block truncate font-semibold text-foreground"
            title={providerLabel(row.original.proveedor)}
          >
            {providerLabel(row.original.proveedor)}
          </span>
        </CellIcon>
      ),
    },
    {
      id: "fecha_emision",
      accessorFn: (row) => parseEmisionDate(row.fecha_emision)?.getTime() ?? 0,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emisión" />
      ),
      cell: ({ row }) => (
        <CellIcon icon={CalendarDays}>
          <span className="font-semibold whitespace-nowrap text-foreground">
            {formatDate(row.original.fecha_emision)}
          </span>
        </CellIcon>
      ),
    },
    {
      accessorKey: "total_pagar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col items-end gap-0.5 text-right">
          <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            {formatCurrency(row.original.total_pagar, row.original.moneda)}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {row.original.moneda}
          </span>
        </div>
      ),
    },
  ];

  if (showEstado) {
    columns.push({
      accessorKey: "estado",
      header: "Estado",
      enableSorting: false,
      cell: ({ row }) => (
        <Badge
          variant={row.original.estado === "parsed" ? "default" : "secondary"}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            row.original.estado === "parsed"
              ? "bg-primary/12 text-primary ring-1 ring-primary/20 hover:bg-primary/18"
              : "bg-muted text-muted-foreground",
          )}
        >
          <FileText className="mr-1.5 inline h-3.5 w-3.5" />
          {row.original.estado === "parsed" ? "Procesada" : "Pendiente"}
        </Badge>
      ),
    });
  }

  columns.push({
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DeleteFacturaButton
          facturaId={row.original.id}
          label={row.original.numero_factura}
          iconOnly
          onDeleted={() => onDeleted?.(row.original.id)}
        />
      </div>
    ),
  });

  return columns;
}
