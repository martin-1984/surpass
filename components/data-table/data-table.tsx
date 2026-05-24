"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  resetKey?: string | number;
  pageSize?: number;
  emptyMessage?: string;
  wide?: boolean;
  mobileHeader?: React.ReactNode;
  desktopHeader?: React.ReactNode;
  desktopContainerClassName?: string;
  mobileRenderer?: (rows: TData[]) => React.ReactNode;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  resetKey,
  pageSize = 10,
  emptyMessage = "Sin resultados.",
  wide = false,
  mobileHeader,
  desktopHeader,
  desktopContainerClassName,
  mobileRenderer,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    initialState: {
      pagination: { pageSize },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [resetKey, data.length]);

  const pageRows = table.getRowModel().rows.map((row) => row.original);

  return (
    <div className={cn("space-y-5", className)}>
      {mobileHeader}

      {mobileRenderer ? (
        <div className="space-y-4 lg:hidden">
          {mobileRenderer(pageRows)}
          <DataTablePagination table={table} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-4 backdrop-blur-sm" />
        </div>
      ) : null}

      <div
        className={cn(
          "space-y-5",
          mobileRenderer ? "hidden lg:block" : undefined,
          desktopContainerClassName,
        )}
      >
        {desktopHeader}

        <div
          className={cn(
            "table-modern glass-panel overflow-hidden rounded-2xl shadow-sm",
            wide && "table-scroll--wide",
          )}
        >
          <div className={cn("table-scroll table-scroll--airy", wide && "table-scroll--wide")}>
            <Table className="table-modern__table">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="table-modern__head">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="table-modern__body">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className="table-modern__row group border-none"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="table-modern__cell">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="table-modern__empty h-32 text-center text-base text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination
            table={table}
            className="border-t border-border/50 bg-muted/20 px-5 py-4 sm:px-6"
          />
        </div>
      </div>

      {!mobileRenderer ? <DataTablePagination table={table} className="pt-2" /> : null}
    </div>
  );
}
