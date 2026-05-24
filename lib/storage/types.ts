import { createClient } from "@supabase/supabase-js";
import type { Factura, FacturaItem, FacturaWithItems } from "@/lib/types/database";

export interface DashboardStats {
  totalFacturas: number;
  totalMonto: number;
  facturasRecientes: Factura[];
}

export interface CreateFacturaInput {
  numeroFactura: string;
  proveedor: string;
  rucEmisor: string | null;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  totalPagar: number | null;
  moneda: string;
  archivoNombre: string;
  archivoPath: string;
  archivoUrl: string | null;
  estado: "parsed" | "pending";
  subidoPor: string | null;
  items: Array<{
    item: string;
    cantidad: number;
    unidad: string;
    codigo: string;
    descripcion: string;
    valorUnitario: number;
    descuento: number;
    precioUnitario: number;
    valorVenta: number;
  }>;
}

export interface StorageAdapter {
  savePdf(fileName: string, buffer: Buffer): Promise<{ path: string; url: string | null }>;
  createFactura(input: CreateFacturaInput): Promise<FacturaWithItems>;
  listFacturas(): Promise<Factura[]>;
  listFacturasWithItems(): Promise<FacturaWithItems[]>;
  getFactura(id: string): Promise<FacturaWithItems | null>;
  getDashboardStats(): Promise<DashboardStats>;
}

function isValidSupabaseUrl(url: string) {
  if (!url || url.includes("tu-proyecto")) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co") &&
      parsed.pathname === "/"
    );
  } catch {
    return false;
  }
}

function isValidSupabaseKey(key: string) {
  return Boolean(key && key.length > 20 && !key.includes("tu-anon-key") && !key.includes("tu-service-role"));
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key && isValidSupabaseUrl(url) && isValidSupabaseKey(key));
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) {
    throw new Error("Supabase no está configurado");
  }

  if (!isValidSupabaseUrl(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL inválida. Debe ser https://TU-ID.supabase.co",
    );
  }

  if (!isValidSupabaseKey(key)) {
    throw new Error("Clave de Supabase inválida o placeholder");
  }

  return createClient(url, key);
}

export type { Factura, FacturaItem, FacturaWithItems };
