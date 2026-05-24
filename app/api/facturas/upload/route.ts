import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";
import { parseInvoicePdf } from "@/lib/pdf/parse-invoice";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo PDF requerido" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageAdapter();

    let parsed;

    try {
      parsed = await parseInvoicePdf(buffer);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "No se pudo procesar el PDF",
        },
        { status: 422 },
      );
    }

    const numeroFactura = (parsed.numeroFactura || file.name).trim();
    const proveedor = parsed.provider;

    const existing = await storage.findFacturaByProveedorAndNumero(proveedor, numeroFactura);
    if (existing) {
      await storage.deleteFactura(existing.id);
    }

    const savedFile = await storage.savePdf(file.name, buffer);

    const factura = await storage.createFactura({
      numeroFactura,
      proveedor,
      rucEmisor: parsed.rucEmisor || null,
      fechaEmision: parsed.fechaEmision,
      fechaVencimiento: parsed.fechaVencimiento,
      totalPagar: parsed.totalPagar,
      moneda: parsed.moneda,
      archivoNombre: file.name,
      archivoPath: savedFile.path,
      archivoUrl: savedFile.url,
      estado: "parsed",
      subidoPor: null,
      items: parsed.items.map((item) => ({
        item: item.item,
        cantidad: item.cantidad,
        unidad: item.unidad,
        codigo: item.codigo,
        descripcion: item.descripcion,
        valorUnitario: item.valorUnitario,
        descuento: item.descuento,
        precioUnitario: item.precioUnitario,
        valorVenta: item.valorVenta,
      })),
    });

    revalidatePath("/dashboard");
    revalidatePath("/facturas");
    revalidatePath("/reportes");

    return NextResponse.json({
      factura,
      parsed,
      replaced: Boolean(existing),
      replacedId: existing?.id ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir factura" },
      { status: 500 },
    );
  }
}
