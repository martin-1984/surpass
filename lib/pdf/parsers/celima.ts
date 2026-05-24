import type { InvoiceLineItem, InvoiceParser, ParsedInvoice } from "../types";

const LINE_PATTERN =
  /(\d{3})\s+([\d.]+)\s+([A-Z]{2,4})\s+(\d{4,9})\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/g;

function parseNumber(value: string): number {
  return Number(value.replace(/,/g, ""));
}

function parseHeader(text: string): Partial<ParsedInvoice> {
  const numeroMatch =
    text.match(/F004\s*-\s*(\d+)/i) ?? text.match(/FACTURA\s*:?\s*F004\s*-\s*(\d+)/i);
  const rucMatch = text.match(/R\.?U\.?C\.?\s*(\d{11})/i);
  const fechaMatch =
    text.match(
      /FECHA\s*EMISI[OÓ]N[\s\S]*?FECHA\s*VENCIMIENTO[\s\S]*?(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/i,
    ) ?? text.match(/(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/);
  const totalMatch = text.match(/TOTAL A PAGAR\s*\(S\/\)\s*([\d,]+\.\d{2})/i);

  return {
    numeroFactura: numeroMatch ? `F004-${numeroMatch[1]}` : "",
    rucEmisor: rucMatch?.[1] ?? "",
    proveedor: "Cerámica Lima S.A.",
    fechaEmision: fechaMatch?.[1] ?? null,
    fechaVencimiento: fechaMatch?.[2] ?? null,
    moneda: "PEN",
    totalPagar: totalMatch ? parseNumber(totalMatch[1]) : null,
  };
}

function parseItems(text: string): InvoiceLineItem[] {
  const items: InvoiceLineItem[] = [];
  const tableStart = text.indexOf("VALOR VENTA");
  const searchText = tableStart >= 0 ? text.slice(tableStart) : text;

  for (const match of searchText.matchAll(LINE_PATTERN)) {
    items.push({
      item: match[1],
      cantidad: parseNumber(match[2]),
      unidad: match[3],
      codigo: match[4],
      descripcion: match[5].trim(),
      valorUnitario: parseNumber(match[6]),
      descuento: parseNumber(match[7]),
      precioUnitario: parseNumber(match[8]),
      valorVenta: parseNumber(match[9]),
    });
  }

  return items;
}

export const celimaParser: InvoiceParser = {
  provider: "celima",

  canParse(text: string) {
    return /CERAMICA LIMA|F004\s*-/i.test(text);
  },

  parse(text: string): ParsedInvoice {
    const header = parseHeader(text);
    const items = parseItems(text);

    return {
      provider: "celima",
      numeroFactura: header.numeroFactura ?? "",
      rucEmisor: header.rucEmisor ?? "",
      proveedor: header.proveedor ?? "Cerámica Lima S.A.",
      fechaEmision: header.fechaEmision ?? null,
      fechaVencimiento: header.fechaVencimiento ?? null,
      moneda: header.moneda ?? "PEN",
      totalPagar: header.totalPagar ?? null,
      items,
    };
  },
};
