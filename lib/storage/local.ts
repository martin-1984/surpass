import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { FacturaWithItems, StorageAdapter } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const PDF_DIR = path.join(DATA_DIR, "pdfs");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface LocalDb {
  facturas: FacturaWithItems[];
}

async function ensureDirs() {
  await mkdir(PDF_DIR, { recursive: true });
}

async function readDb(): Promise<LocalDb> {
  await ensureDirs();
  try {
    const raw = await readFile(DB_FILE, "utf-8");
    return JSON.parse(raw) as LocalDb;
  } catch {
    return { facturas: [] };
  }
}

async function writeDb(db: LocalDb) {
  await ensureDirs();
  await writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export const localStorageAdapter: StorageAdapter = {
  async savePdf(fileName, buffer) {
    await ensureDirs();
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(PDF_DIR, safeName);
    await writeFile(filePath, buffer);
    return {
      path: safeName,
      url: `/api/facturas/file/${encodeURIComponent(safeName)}`,
    };
  },

  async createFactura(input) {
    const db = await readDb();
    const facturaId = randomUUID();
    const now = new Date().toISOString();

    const factura: FacturaWithItems = {
      id: facturaId,
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
      created_at: now,
      factura_items: input.items.map((item) => ({
        id: randomUUID(),
        factura_id: facturaId,
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
    };

    db.facturas.unshift(factura);
    await writeDb(db);
    return factura;
  },

  async listFacturas() {
    const db = await readDb();
    return db.facturas.map(({ factura_items, ...factura }) => {
      void factura_items;
      return factura;
    });
  },

  async listFacturasWithItems() {
    const db = await readDb();
    return db.facturas;
  },

  async getFactura(id) {
    const db = await readDb();
    return db.facturas.find((factura) => factura.id === id) ?? null;
  },

  async getDashboardStats() {
    const db = await readDb();
    const facturas = db.facturas.map(({ factura_items, ...factura }) => {
      void factura_items;
      return factura;
    });

    return {
      totalFacturas: facturas.length,
      totalMonto: facturas.reduce((sum, factura) => sum + (factura.total_pagar ?? 0), 0),
      facturasRecientes: facturas.slice(0, 5),
    };
  },
};

export async function readLocalPdf(fileName: string) {
  const filePath = path.join(PDF_DIR, fileName);
  return readFile(filePath);
}
