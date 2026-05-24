import { FacturasList } from "@/components/facturas-list";
import { filterFacturas } from "@/lib/facturas-filter";
import { getStorageAdapter } from "@/lib/storage";

export default async function FacturasPage() {
  const storage = getStorageAdapter();
  const facturas = filterFacturas(await storage.listFacturas(), {
    uploadedToday: true,
  });

  return <FacturasList initialFacturas={facturas} initialMode="uploadedToday" />;
}
