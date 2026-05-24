import { FacturaDetail } from "@/components/factura-detail";
import { buildFacturasReturnHref } from "@/lib/facturas-list-state";
import { getStorageAdapter } from "@/lib/storage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FacturaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const raw = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") urlParams.set(key, value);
  }

  const storage = getStorageAdapter();
  const factura = await storage.getFactura(id);

  if (!factura) {
    notFound();
  }

  return (
    <FacturaDetail factura={factura} returnHref={buildFacturasReturnHref(urlParams)} />
  );
}
