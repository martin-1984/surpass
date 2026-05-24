import { isSameFactura } from "@/lib/factura-identity";
import { createServiceClient } from "./types";
import type {
  CreateFacturaInput,
  DashboardStats,
  Factura,
  FacturaWithItems,
  StorageAdapter,
} from "./types";

function mapFactura(row: Record<string, unknown>): Factura {
  return {
    id: String(row.id),
    numero_factura: String(row.numero_factura),
    proveedor: String(row.proveedor),
    ruc_emisor: row.ruc_emisor ? String(row.ruc_emisor) : null,
    fecha_emision: row.fecha_emision ? String(row.fecha_emision) : null,
    fecha_vencimiento: row.fecha_vencimiento ? String(row.fecha_vencimiento) : null,
    total_pagar: row.total_pagar != null ? Number(row.total_pagar) : null,
    moneda: String(row.moneda ?? "PEN"),
    archivo_url: row.archivo_url ? String(row.archivo_url) : null,
    archivo_nombre: String(row.archivo_nombre),
    archivo_path: row.archivo_path ? String(row.archivo_path) : null,
    estado: row.estado === "pending" ? "pending" : "parsed",
    subido_por: row.subido_por ? String(row.subido_por) : null,
    created_at: String(row.created_at),
  };
}

export const supabaseStorageAdapter: StorageAdapter = {
  async savePdf(fileName, buffer) {
    const supabase = createServiceClient();
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error } = await supabase.storage.from("facturas").upload(safeName, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage.from("facturas").getPublicUrl(safeName);

    return {
      path: safeName,
      url: urlData.publicUrl,
    };
  },

  async findFacturaByProveedorAndNumero(proveedor: string, numeroFactura: string) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("facturas")
      .select("*, factura_items(*)")
      .eq("numero_factura", numeroFactura.trim());

    if (error) throw new Error(error.message);

    const match = (data ?? []).find((row) =>
      isSameFactura(
        { proveedor: String(row.proveedor), numero_factura: String(row.numero_factura) },
        proveedor,
        numeroFactura,
      ),
    );

    if (!match) return null;

    const items = (match.factura_items ?? []) as Array<Record<string, unknown>>;
    return {
      ...mapFactura(match),
      factura_items: items.map((item) => ({
        id: String(item.id),
        factura_id: String(item.factura_id),
        item: String(item.item),
        cantidad: Number(item.cantidad),
        unidad: String(item.unidad),
        codigo: String(item.codigo),
        descripcion: String(item.descripcion),
        valor_unitario: Number(item.valor_unitario),
        descuento: Number(item.descuento),
        precio_unitario: Number(item.precio_unitario),
        valor_venta: Number(item.valor_venta),
      })),
    } satisfies FacturaWithItems;
  },

  async deleteFactura(id: string) {
    const supabase = createServiceClient();
    const existing = await this.getFactura(id);

    if (existing?.archivo_path) {
      const { error: storageError } = await supabase.storage
        .from("facturas")
        .remove([existing.archivo_path]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    const { error } = await supabase.from("facturas").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async createFactura(input: CreateFacturaInput) {
    const supabase = createServiceClient();

    const { data: factura, error: facturaError } = await supabase
      .from("facturas")
      .insert({
        numero_factura: input.numeroFactura,
        proveedor: input.proveedor,
        ruc_emisor: input.rucEmisor,
        fecha_emision: input.fechaEmision,
        fecha_vencimiento: input.fechaVencimiento,
        total_pagar: input.totalPagar,
        moneda: input.moneda,
        archivo_url: input.archivoUrl,
        archivo_nombre: input.archivoNombre,
        archivo_path: input.archivoPath,
        estado: input.estado,
        subido_por: input.subidoPor,
      })
      .select("*")
      .single();

    if (facturaError || !factura) {
      throw new Error(facturaError?.message ?? "No se pudo guardar la factura");
    }

    const { data: items, error: itemsError } = await supabase
      .from("factura_items")
      .insert(
        input.items.map((item) => ({
          factura_id: factura.id,
          item: item.item,
          cantidad: item.cantidad,
          unidad: item.unidad,
          codigo: item.codigo,
          descripcion: item.descripcion,
          valor_unitario: item.valorUnitario,
          descuento: item.descuento,
          precio_unitario: item.precioUnitario,
          valor_venta: item.valorVenta,
        })),
      )
      .select("*");

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    return {
      ...mapFactura(factura),
      factura_items: (items ?? []).map((item) => ({
        id: String(item.id),
        factura_id: String(item.factura_id),
        item: String(item.item),
        cantidad: Number(item.cantidad),
        unidad: String(item.unidad),
        codigo: String(item.codigo),
        descripcion: String(item.descripcion),
        valor_unitario: Number(item.valor_unitario),
        descuento: Number(item.descuento),
        precio_unitario: Number(item.precio_unitario),
        valor_venta: Number(item.valor_venta),
      })),
    } satisfies FacturaWithItems;
  },

  async listFacturas() {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("facturas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapFactura);
  },

  async listFacturasWithItems() {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("facturas")
      .select("*, factura_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const items = (row.factura_items ?? []) as Array<Record<string, unknown>>;
      return {
        ...mapFactura(row),
        factura_items: items.map((item) => ({
          id: String(item.id),
          factura_id: String(item.factura_id),
          item: String(item.item),
          cantidad: Number(item.cantidad),
          unidad: String(item.unidad),
          codigo: String(item.codigo),
          descripcion: String(item.descripcion),
          valor_unitario: Number(item.valor_unitario),
          descuento: Number(item.descuento),
          precio_unitario: Number(item.precio_unitario),
          valor_venta: Number(item.valor_venta),
        })),
      } satisfies FacturaWithItems;
    });
  },

  async getFactura(id: string) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("facturas")
      .select("*, factura_items(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const items = (data.factura_items ?? []) as Array<Record<string, unknown>>;

    return {
      ...mapFactura(data),
      factura_items: items.map((item) => ({
        id: String(item.id),
        factura_id: String(item.factura_id),
        item: String(item.item),
        cantidad: Number(item.cantidad),
        unidad: String(item.unidad),
        codigo: String(item.codigo),
        descripcion: String(item.descripcion),
        valor_unitario: Number(item.valor_unitario),
        descuento: Number(item.descuento),
        precio_unitario: Number(item.precio_unitario),
        valor_venta: Number(item.valor_venta),
      })),
    } satisfies FacturaWithItems;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const facturas = await this.listFacturas();
    return {
      totalFacturas: facturas.length,
      totalMonto: facturas.reduce((sum, factura) => sum + (factura.total_pagar ?? 0), 0),
      facturasRecientes: facturas.slice(0, 5),
    };
  },
};
