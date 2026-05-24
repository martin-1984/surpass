import { NextResponse } from "next/server";
import { facturasToExcelBuffer } from "@/lib/export-excel";
import {
  filterFacturasWithItems,
  parseFacturasQuery,
} from "@/lib/facturas-filter";
import { getStorageAdapter } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseFacturasQuery(searchParams);
    const storage = getStorageAdapter();
    const all = await storage.listFacturasWithItems();
    const filtered = filterFacturasWithItems(all, filters);

    if (filtered.length === 0) {
      return NextResponse.json(
        { error: "No hay facturas en el rango seleccionado para exportar" },
        { status: 404 },
      );
    }

    const buffer = facturasToExcelBuffer(filtered);
    const filename =
      filters.uploadedToday
        ? `facturas_subidas_${new Date().toISOString().slice(0, 10)}.xlsx`
        : `facturas_emision_${filters.emisionDesde}_${filters.emisionHasta}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al exportar" },
      { status: 500 },
    );
  }
}
