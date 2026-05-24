import type { InvoiceLineItem, InvoiceParser, ParsedInvoice } from "../types";

const LINE_PATTERN =
  /([\d.]+)(\d{6,9})\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})([\d,]+\.\d{2})\s+NIU\s*-\s*UNI\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})(\d+)\s+([\d,]+\.\d{2})/g;

function parseNumber(value: string): number {
  return Number(value.replace(/,/g, ""));
}

const DATE_PATTERN = String.raw`(\d{2}\/\d{2}\/\d{4})`;

function extractDatesFromBlock(block: string): string[] {
  return [...block.matchAll(new RegExp(DATE_PATTERN, "g"))].map((match) => match[1]);
}

function parseSaintGobainDates(text: string): {
  fechaEmision: string | null;
  fechaVencimiento: string | null;
} {
  // Layout habitual: FECHA EMISION … FECHA VENCIMIENTO … dd/mm/aaaa dd/mm/aaaa
  const standardLayout = text.match(
    new RegExp(
      `FECHA\\s*EMISI[OÓ]N[\\s\\S]*?FECHA\\s*VENCIMIENTO[\\s\\S]*?${DATE_PATTERN}\\s+${DATE_PATTERN}`,
      "i",
    ),
  );
  if (standardLayout) {
    return {
      fechaEmision: standardLayout[1],
      fechaVencimiento: standardLayout[2],
    };
  }

  // Layout del PDF real: FECHA VENCIMIENTO … 12/07/2026 … 13/05/2026 … FECHA EMISION
  const invertedLayout = text.match(/FECHA\s*VENCIMIENTO[\s\S]*?FECHA\s*EMISI[OÓ]N/i);
  if (invertedLayout) {
    const dates = extractDatesFromBlock(invertedLayout[0]);
    if (dates.length >= 2) {
      return {
        fechaVencimiento: dates[0],
        fechaEmision: dates[1],
      };
    }
  }

  const emisionLabeled = text.match(
    new RegExp(`FECHA\\s*EMISI[OÓ]N\\D{0,40}${DATE_PATTERN}`, "i"),
  );
  const vencimientoLabeled = text.match(
    new RegExp(`FECHA\\s*VENCIMIENTO\\D{0,40}${DATE_PATTERN}`, "i"),
  );

  if (emisionLabeled && vencimientoLabeled) {
    return {
      fechaEmision: emisionLabeled[1],
      fechaVencimiento: vencimientoLabeled[1],
    };
  }

  return {
    fechaEmision: emisionLabeled?.[1] ?? null,
    fechaVencimiento: vencimientoLabeled?.[1] ?? null,
  };
}

function parseHeader(text: string): Partial<ParsedInvoice> {
  const numeroMatch =
    text.match(/FV01-(\d+)/i) ?? text.match(/Nº\s*(\d+)/i);
  const rucMatch = text.match(/R\.?U\.?C\.?\s*(\d{11})/i);
  const totalMatch = text.match(/IMPORTE TOTAL\s*S\/\s*([\d,]+\.\d{2})/i);
  const { fechaEmision, fechaVencimiento } = parseSaintGobainDates(text);

  return {
    numeroFactura: numeroMatch ? `FV01-${numeroMatch[1]}` : "",
    rucEmisor: rucMatch?.[1] ?? "",
    proveedor: "Saint-Gobain Productos para la Construcción S.A.C.",
    fechaEmision,
    fechaVencimiento,
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
