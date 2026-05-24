import { NextResponse } from "next/server";
import { readLocalPdf } from "@/lib/storage/local";
import { isSupabaseConfigured } from "@/lib/storage/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> },
) {
  try {
  if (isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Descarga directa solo disponible en modo local" },
        { status: 404 },
      );
    }

    const { fileName } = await params;
    const decoded = decodeURIComponent(fileName);
    const buffer = await readLocalPdf(decoded);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${decoded}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
}
