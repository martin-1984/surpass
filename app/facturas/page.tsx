import { FacturasList } from "@/components/facturas-list";
import { filterFacturas } from "@/lib/facturas-filter";
import {
  listStateToFilterParams,
  parseFacturasListState,
} from "@/lib/facturas-list-state";
import { getStorageAdapter } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function FacturasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") urlParams.set(key, value);
  }

  const listState = parseFacturasListState(urlParams);
  const storage = getStorageAdapter();
  const facturas = filterFacturas(
    await storage.listFacturas(),
    listStateToFilterParams(listState),
  );

  return (
    <FacturasList
      initialFacturas={facturas}
      initialFilters={listState}
      initialListQuery={urlParams.toString() || "uploadedToday=true"}
    />
  );
}
