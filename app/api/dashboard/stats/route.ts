import { NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";

export async function GET() {
  try {
    const storage = getStorageAdapter();
    const stats = await storage.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al cargar dashboard" },
      { status: 500 },
    );
  }
}
