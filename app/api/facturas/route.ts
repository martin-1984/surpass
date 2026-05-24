import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";
import {
  filterFacturas,
  parseFacturasQuery,
} from "@/lib/facturas-filter";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseFacturasQuery(searchParams);
    const storage = getStorageAdapter();
    const facturas = await storage.listFacturas();
    const filtered = filterFacturas(facturas, filters);

    return NextResponse.json({ facturas: filtered, filters });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al listar facturas" },
      { status: 500 },
    );
  }
}
