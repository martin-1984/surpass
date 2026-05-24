import { FacturaDetail } from "@/components/factura-detail";
import { getStorageAdapter } from "@/lib/storage";
import { notFound } from "next/navigation";

export default async function FacturaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storage = getStorageAdapter();
  const factura = await storage.getFactura(id);

  if (!factura) {
    notFound();
  }

  return <FacturaDetail factura={factura} />;
}
