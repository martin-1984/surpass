import { describe, expect, it } from "vitest";
import { buildReport } from "./build-report";
import type { Factura, FacturaWithItems } from "@/lib/types/database";

const baseFactura: Factura = {
  id: "1",
  numero_factura: "F004-001",
  proveedor: "celima",
  ruc_emisor: "20101026001",
  fecha_emision: "15/05/2026",
  fecha_vencimiento: "14/07/2026",
  total_pagar: 1000,
  moneda: "PEN",
  archivo_url: null,
  archivo_nombre: "a.pdf",
  archivo_path: null,
  estado: "parsed",
  subido_por: null,
  created_at: new Date().toISOString(),
};

const facturaWithItems: FacturaWithItems = {
  ...baseFactura,
  factura_items: [
    {
      id: "i1",
      factura_id: "1",
      item: "001",
      cantidad: 2,
      unidad: "NIU",
      codigo: "610005687",
      descripcion: "Producto prueba",
      valor_unitario: 100,
      descuento: 0,
      precio_unitario: 100,
      valor_venta: 200,
    },
  ],
};

const filters = {
  emisionDesde: "2026-05-01",
  emisionHasta: "2026-05-31",
  proveedor: null,
};

describe("buildReport", () => {
  it("genera resumen con métricas", () => {
    const report = buildReport({
      type: "resumen",
      filters,
      facturas: [baseFactura],
    });
    expect(report.type).toBe("resumen");
    expect(report.rows.some((r) => r.metrica === "Total facturas")).toBe(true);
  });

  it("genera por proveedor con porcentajes", () => {
    const report = buildReport({
      type: "por_proveedor",
      filters,
      facturas: [baseFactura],
    });
    expect(report.rows.length).toBeGreaterThan(0);
    expect(report.footer?.proveedor).toBe("Total");
  });

  it("genera detalle de líneas", () => {
    const report = buildReport({
      type: "detalle_lineas",
      filters,
      facturas: [baseFactura],
      facturasWithItems: [facturaWithItems],
    });
    expect(report.rows).toHaveLength(1);
    expect(report.rows[0].codigo).toBe("610005687");
  });

  it("genera top productos", () => {
    const report = buildReport({
      type: "top_productos",
      filters,
      facturas: [baseFactura],
      facturasWithItems: [facturaWithItems],
    });
    expect(report.rows[0].codigo).toBe("610005687");
  });
});
