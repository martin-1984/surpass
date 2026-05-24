"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getInvoiceColumns } from "@/components/invoices/columns";
import { InvoiceMobileList } from "@/components/invoice-mobile-list";
import type { Factura } from "@/lib/types/database";

interface InvoicesDataViewProps {
  facturas: Factura[];
  showEstado?: boolean;
  resetKey?: string | number;
  listQuery?: string;
}

export function InvoicesDataView({
  facturas,
  showEstado = false,
  resetKey,
  listQuery = "",
}: InvoicesDataViewProps) {
  const columns = useMemo(
    () => getInvoiceColumns(showEstado, listQuery),
    [showEstado, listQuery],
  );

  return (
    <DataTable
      columns={columns}
      data={facturas}
      resetKey={resetKey}
      mobileRenderer={(rows) => (
        <InvoiceMobileList facturas={rows} showEstado={showEstado} listQuery={listQuery} />
      )}
    />
  );
}
