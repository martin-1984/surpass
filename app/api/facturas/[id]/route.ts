import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const storage = getStorageAdapter();
    const factura = await storage.getFactura(id);

    if (!factura) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ factura });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener factura" },
      { status: 500 },
    );
  }
}
