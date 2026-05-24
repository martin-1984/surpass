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

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase no está configurado");
  }

  return createClient(url, key);
}

export type { Factura, FacturaItem, FacturaWithItems };
