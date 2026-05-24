import type { InvoiceLineItem, InvoiceParser, ParsedInvoice } from "../types";

const LINE_PATTERN =
  /([\d.]+)(\d{6,9})\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})([\d,]+\.\d{2})\s+NIU\s*-\s*UNI\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})(\d+)\s+([\d,]+\.\d{2})/g;

function parseNumber(value: string): number {
  return Number(value.replace(/,/g, ""));
}

function parseHeader(text: string): Partial<ParsedInvoice> {
  const numeroMatch =
    text.match(/FV01-(\d+)/i) ?? text.match(/Nº\s*(\d+)/i);
  const rucMatch = text.match(/R\.?U\.?C\.?\s*(\d{11})/i);
  const fechaMatch = text.match(
    /VENCIMIENTO A 60 DIAS\s*(\d{2}\/\d{2}\/\d{4})\s+(\d+)/,
  );
  const fechaAlt = text.match(/(\d{2}\/\d{2}\/\d{4}).*?(\d{2}\/\d{2}\/\d{4})/);
  const totalMatch = text.match(/IMPORTE TOTAL\s*S\/\s*([\d,]+\.\d{2})/i);

  return {
    numeroFactura: numeroMatch ? `FV01-${numeroMatch[1]}` : "",
    rucEmisor: rucMatch?.[1] ?? "",
    proveedor: "Saint-Gobain Productos para la Construcción S.A.C.",
    fechaEmision: fechaAlt?.[1] ?? null,
    fechaVencimiento: fechaMatch?.[1] ?? fechaAlt?.[2] ?? null,
    moneda: "PEN",
    totalPagar: totalMatch ? parseNumber(totalMatch[1]) : null,
  };
}

function parseItems(text: string): InvoiceLineItem[] {
  const items: InvoiceLineItem[] = [];
  const startIndex = text.indexOf("SAINT-GOBAIN");
  const searchText = startIndex >= 0 ? text.slice(startIndex) : text;

  for (const match of searchText.matchAll(LINE_PATTERN)) {
    const cantidad = parseNumber(match[6]);
    const valorVenta = parseNumber(match[4]);
    const precioVenta = parseNumber(match[5]);

    items.push({
      item: match[10],
      cantidad,
      unidad: "NIU",
      codigo: match[2],
      descripcion: match[3].trim(),
      valorUnitario: cantidad > 0 ? valorVenta / cantidad : parseNumber(match[7]),
      descuento: parseNumber(match[1]),
      precioUnitario: cantidad > 0 ? precioVenta / cantidad : parseNumber(match[11]),
      valorVenta,
    });
  }

  return items;
}

export const saintGobainParser: InvoiceParser = {
  provider: "saint-gobain",

  canParse(text: string) {
    return /SAINT-GOBAIN|FV01/i.test(text);
  },

  parse(text: string): ParsedInvoice {
    const header = parseHeader(text);
    const items = parseItems(text);

    return {
      provider: "saint-gobain",
      numeroFactura: header.numeroFactura ?? "",
      rucEmisor: header.rucEmisor ?? "",
      proveedor: header.proveedor ?? "Saint-Gobain",
      fechaEmision: header.fechaEmision ?? null,
      fechaVencimiento: header.fechaVencimiento ?? null,
      moneda: header.moneda ?? "PEN",
      totalPagar: header.totalPagar ?? null,
      items,
    };
  },
};
