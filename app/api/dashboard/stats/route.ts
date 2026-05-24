import { NextRequest, NextResponse } from "next/server";
import {
  computeDashboardAnalytics,
  parseDashboardQuery,
} from "@/lib/dashboard-analytics";
import { getStorageAdapter } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const filters = parseDashboardQuery(request.nextUrl.searchParams);
    const storage = getStorageAdapter();
    const facturas = await storage.listFacturas();
    const analytics = computeDashboardAnalytics(facturas, filters);
    return NextResponse.json(analytics, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al cargar dashboard" },
      { status: 500 },
    );
  }
}
