import { ReportesView } from "@/components/reportes/reportes-view";
import {
  extractAvailableYears,
  extractProveedores,
} from "@/lib/dashboard-analytics";
import { parseReportQuery } from "@/lib/reports/filters";
import { isReportType } from "@/lib/reports/validate";
import type { ReportType } from "@/lib/reports/types";
import { getStorageAdapter } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") urlParams.set(key, value);
  }

  const { filters: initialFilters, type: typeParam } = parseReportQuery(urlParams);
  const initialType: ReportType = isReportType(typeParam) ? typeParam : "resumen";

  const storage = getStorageAdapter();
  const facturas = await storage.listFacturas();

  return (
    <ReportesView
      proveedores={extractProveedores(facturas)}
      añosDisponibles={extractAvailableYears(facturas)}
      initialType={initialType}
      initialFilters={initialFilters}
    />
  );
}
