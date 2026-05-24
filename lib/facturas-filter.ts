import type { Factura, FacturaWithItems } from "@/lib/types/database";
import {
  isEmisionInRange,
  isUploadedToday,
} from "@/lib/date-emision";

export interface FacturasFilterParams {
  uploadedToday?: boolean;
  emisionDesde?: string;
  emisionHasta?: string;
}

export function filterFacturas(
  facturas: Factura[],
  params: FacturasFilterParams,
): Factura[] {
  let result = facturas;

  if (params.uploadedToday) {
    result = result.filter((f) => isUploadedToday(f.created_at));
  }

  if (params.emisionDesde && params.emisionHasta) {
    result = result.filter((f) =>
      isEmisionInRange(f.fecha_emision, params.emisionDesde!, params.emisionHasta!),
    );
  }

  return result;
}

export function filterFacturasWithItems(
  facturas: FacturaWithItems[],
  params: FacturasFilterParams,
): FacturaWithItems[] {
  const headers = facturas.map(({ factura_items, ...factura }) => {
    void factura_items;
    return factura;
  });
  const filteredIds = new Set(filterFacturas(headers, params).map((f) => f.id));
  return facturas.filter((f) => filteredIds.has(f.id));
}

export function parseFacturasQuery(searchParams: URLSearchParams): FacturasFilterParams {
  const emisionDesde = searchParams.get("emisionDesde") ?? undefined;
  const emisionHasta = searchParams.get("emisionHasta") ?? undefined;
  const uploadedToday = searchParams.get("uploadedToday") === "true";

  if (emisionDesde && emisionHasta) {
    return { emisionDesde, emisionHasta };
  }

  if (uploadedToday) {
    return { uploadedToday: true };
  }

  return { uploadedToday: true };
}
