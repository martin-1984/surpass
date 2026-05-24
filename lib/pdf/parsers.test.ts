import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { extractPdfText } from "./extract-text";
import { parseInvoiceText } from "./detect-provider";

const pdfDir = path.join(process.cwd(), "pdf");

function readPdf(fileName: string) {
  return readFileSync(path.join(pdfDir, fileName));
}

describe("PDF parsers", () => {
  it("parsea factura Cerámica Lima F004-00620143", async () => {
    const buffer = readPdf("20101026001-01-F004-00620143.pdf");
    const text = await extractPdfText(buffer);
    const parsed = parseInvoiceText(text);

    expect(parsed.provider).toBe("celima");
    expect(parsed.numeroFactura).toBe("F004-00620143");
    expect(parsed.items).toHaveLength(2);
    expect(parsed.items[0]).toMatchObject({
      item: "001",
      cantidad: 190.08,
      unidad: "MTK",
      codigo: "610005687",
      valorUnitario: 43.9,
      valorVenta: 4902.57,
    });
    expect(parsed.totalPagar).toBe(6372.68);
  });

  it("parsea factura Cerámica Lima F004-00620144", async () => {
    const buffer = readPdf("20101026001-01-F004-00620144.pdf");
    const text = await extractPdfText(buffer);
    const parsed = parseInvoiceText(text);

    expect(parsed.provider).toBe("celima");
    expect(parsed.numeroFactura).toBe("F004-00620144");
    expect(parsed.items.length).toBeGreaterThanOrEqual(2);
    expect(parsed.totalPagar).toBe(5477.96);
  });

  it("parsea factura Saint-Gobain FV01-142050", async () => {
    const buffer = readPdf("20451775210_01_FV01-142050_156643951.pdf");
    const text = await extractPdfText(buffer);
    const parsed = parseInvoiceText(text);

    expect(parsed.provider).toBe("saint-gobain");
    expect(parsed.numeroFactura).toBe("FV01-142050");
    expect(parsed.fechaEmision).toBe("13/05/2026");
    expect(parsed.fechaVencimiento).toBe("12/07/2026");
    expect(parsed.items.length).toBeGreaterThanOrEqual(10);
    expect(parsed.totalPagar).toBe(30901.56);
  });

  it.each([
    ["20101026001-01-F004-00620143.pdf", "celima"],
    ["20101026001-01-F004-00620144.pdf", "celima", "15/05/2026"],
    ["20161636780-01-F004-00368956.pdf", "celima"],
    ["20161636780-01-F004-00368959.pdf", "celima", "13/05/2026"],
  ] as const)(
    "extrae fecha de emisión en %s",
    async (fileName, provider, expectedEmision) => {
      const buffer = readPdf(fileName);
      const text = await extractPdfText(buffer);
      const parsed = parseInvoiceText(text);

      expect(parsed.provider).toBe(provider);
      expect(parsed.fechaEmision).toBeTruthy();
      if (expectedEmision) {
        expect(parsed.fechaEmision).toBe(expectedEmision);
      }
    },
  );

  it("rechaza PDF sin formato reconocido", () => {
    const fakeText = "A".repeat(60);
    expect(() => parseInvoiceText(fakeText)).toThrow(/Formato de factura no reconocido/);
  });
});
