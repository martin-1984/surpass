import { celimaParser } from "./parsers/celima";
import { saintGobainParser } from "./parsers/saint-gobain";
import type { InvoiceParser, ParsedInvoice } from "./types";

const parsers: InvoiceParser[] = [celimaParser, saintGobainParser];

export function detectParser(text: string): InvoiceParser | null {
  return parsers.find((parser) => parser.canParse(text)) ?? null;
}

export function parseInvoiceText(text: string): ParsedInvoice {
  if (text.trim().length < 50) {
    throw new Error(
      "El PDF no contiene texto legible. Puede ser un escaneo que requiere OCR.",
    );
  }

  const parser = detectParser(text);
  if (!parser) {
    throw new Error(
      "Formato de factura no reconocido. Solo se soportan Cerámica Lima (F004) y Saint-Gobain (FV01).",
    );
  }

  const parsed = parser.parse(text);
  if (parsed.items.length === 0) {
    throw new Error("No se encontraron líneas de detalle en la factura.");
  }

  return parsed;
}
