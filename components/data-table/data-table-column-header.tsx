"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-[11px] font-bold uppercase tracking-[0.14em]", className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-9 gap-1.5 rounded-xl px-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground hover:bg-primary/8 hover:text-primary"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5 text-primary" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-45" />
        )}
      </Button>
    </div>
  );
}
