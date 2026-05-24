export type FacturaEstado = "parsed" | "pending";

export interface Factura {
  id: string;
  numero_factura: string;
  proveedor: string;
  ruc_emisor: string | null;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  total_pagar: number | null;
  moneda: string;
  archivo_url: string | null;
  archivo_nombre: string;
  archivo_path: string | null;
  estado: FacturaEstado;
  subido_por: string | null;
  created_at: string;
}

export interface FacturaItem {
  id: string;
  factura_id: string;
  item: string;
  cantidad: number;
  unidad: string;
  codigo: string;
  descripcion: string;
  valor_unitario: number;
  descuento: number;
  precio_unitario: number;
  valor_venta: number;
}

export interface FacturaWithItems extends Factura {
  factura_items: FacturaItem[];
}
