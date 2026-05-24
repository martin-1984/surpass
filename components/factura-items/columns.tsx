"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/format";
import type { FacturaItem } from "@/lib/types/database";

export function getFacturaItemColumns(moneda: string): ColumnDef<FacturaItem>[] {
  return [
    {
      accessorKey: "item",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item" />
      ),
      cell: ({ row }) => row.original.item,
    },
    {
      accessorKey: "cantidad",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cant." className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right whitespace-nowrap">{row.original.cantidad}</div>
      ),
    },
    {
      accessorKey: "unidad",
      header: "Unid.",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.unidad}</span>
      ),
    },
    {
      accessorKey: "codigo",
      header: "Código",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block truncate font-mono text-xs" title={row.original.codigo}>
          {row.original.codigo}
        </span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-normal break-words">{row.original.descripcion}</span>
      ),
    },
    {
      accessorKey: "valor_unitario",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="V. unit." className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right whitespace-nowrap">
          {formatCurrency(row.original.valor_unitario, moneda)}
        </div>
      ),
    },
    {
      accessorKey: "descuento",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dscto" className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right whitespace-nowrap">
          {formatCurrency(row.original.descuento, moneda)}
        </div>
      ),
    },
    {
      accessorKey: "precio_unitario",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="P. unit." className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right whitespace-nowrap">
          {formatCurrency(row.original.precio_unitario, moneda)}
        </div>
      ),
    },
    {
      accessorKey: "valor_venta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" className="ml-auto justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium whitespace-nowrap text-primary">
          {formatCurrency(row.original.valor_venta, moneda)}
        </div>
      ),
    },
  ];
}
