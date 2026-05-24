import { describe, expect, it } from "vitest";
import { saintGobainParser } from "./saint-gobain";

function parseDates(text: string) {
  const parsed = saintGobainParser.parse(`SAINT-GOBAIN\nFV01-142050\n${text}`);
  return {
    fechaEmision: parsed.fechaEmision,
    fechaVencimiento: parsed.fechaVencimiento,
  };
}

describe("saintGobainParser dates", () => {
  it("lee emisión y vencimiento por etiquetas en la misma línea", () => {
    const dates = parseDates(
      "FECHA EMISION 13/05/2026 FECHA VENCIMIENTO 12/07/2026 VENCIMIENTO A 60 DIAS",
    );
    expect(dates).toEqual({
      fechaEmision: "13/05/2026",
      fechaVencimiento: "12/07/2026",
    });
  });

  it("lee fechas en fila de cabecera (etiquetas y valores separados)", () => {
    const dates = parseDates(`
FECHA EMISION   FECHA VENCIMIENTO   CODIGO CLIENTE
13/05/2026      12/07/2026          446989
FORMA DE PAGO VENCIMIENTO A 60 DIAS
`);
    expect(dates).toEqual({
      fechaEmision: "13/05/2026",
      fechaVencimiento: "12/07/2026",
    });
  });

  it("lee fechas cuando el PDF extrae VENCIMIENTO antes que EMISION (layout invertido)", () => {
    const dates = parseDates(`
FECHA VENCIMIENTO CODIGO CLIENTE 12/07/2026 FORMA DE PAGO VENCIMIENTO A 60 DIAS13/05/2026 446989 FECHA EMISION TIPO MONEDA
`);
    expect(dates).toEqual({
      fechaEmision: "13/05/2026",
      fechaVencimiento: "12/07/2026",
    });
  });

  it("no intercambia fechas por coincidencia genérica en el documento", () => {
    const dates = parseDates(`
12/07/2026 aparece antes en el texto por ruido del PDF
FECHA EMISION 13/05/2026
FECHA VENCIMIENTO 12/07/2026
`);
    expect(dates.fechaEmision).toBe("13/05/2026");
    expect(dates.fechaVencimiento).toBe("12/07/2026");
  });
});
