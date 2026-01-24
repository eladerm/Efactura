import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * Ping básico.
 *
 * @return {void}
 */
export const ping = onRequest((_req, res) => {
  res.json({ok: true});
});

/**
 * Pad con ceros a la izquierda.
 *
 * @param {string|number} val Valor
 * @param {number} len Longitud
 * @return {string} String con ceros
 */
function zpad(val: string | number, len: number): string {
  return String(val).padStart(len, "0");
}

/**
 * Genera clave de acceso SRI (49 dígitos) para FACTURA (codDoc 01).
 *
 * @param {string} fecha Fecha ddmmyyyy
 * @param {string} codDoc Código documento (01)
 * @param {string} ruc RUC emisor
 * @param {string} ambiente 1 pruebas / 2 producción
 * @param {string} estab Establecimiento 3 dígitos
 * @param {string} ptoEmi Punto emisión 3 dígitos
 * @param {string} secuencial Secuencial 9 dígitos
 * @param {string} codigoNum Código numérico 8 dígitos
 * @param {string} tipoEmision 1 normal
 * @return {string} Clave de acceso (49)
 */
function buildClaveAcceso(
  fecha: string,
  codDoc: string,
  ruc: string,
  ambiente: string,
  estab: string,
  ptoEmi: string,
  secuencial: string,
  codigoNum: string,
  tipoEmision: string,
): string {
  const base =
    fecha +
    codDoc +
    ruc +
    ambiente +
    estab +
    ptoEmi +
    secuencial +
    codigoNum +
    tipoEmision;

  let suma = 0;
  let factor = 2;

  for (let i = base.length - 1; i >= 0; i--) {
    suma += parseInt(base[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const mod = suma % 11;
  let dig = 11 - mod;
  if (dig === 11) dig = 0;
  if (dig === 10) dig = 1;

  return base + String(dig);
}

/**
 * Genera XML de factura v2.26 (estructura mínima válida) con claveAcceso.
 *
 * @return {void}
 */
export const buildInvoiceXml = onRequest((req, res) => {
  try {
    const razonSocial = "ELAPIEL";
    const nombreComercial = "ELAPIEL";
    const ruc = "1725885485001";
    const obligadoContabilidad = "NO";

    const ambiente = "1";
    const tipoEmision = "1";
    const codDoc = "01";

    const estab = "001";
    const ptoEmi = "001";
    const secuencial = zpad(1, 9);

    const now = new Date();
    const dd = zpad(now.getDate(), 2);
    const mm = zpad(now.getMonth() + 1, 2);
    const yyyy = String(now.getFullYear());

    const fechaEmision = `${dd}/${mm}/${yyyy}`;
    const fechaClave = `${dd}${mm}${yyyy}`;

    const codigoNumerico = "12345678";

    const claveAcceso = buildClaveAcceso(
      fechaClave,
      codDoc,
      ruc,
      ambiente,
      estab,
      ptoEmi,
      secuencial,
      codigoNumerico,
      tipoEmision,
    );

    const compradorNombre =
      typeof req.body?.compradorNombre === "string" ?
        req.body.compradorNombre :
        "CONSUMIDOR FINAL";

    const compradorDoc =
      typeof req.body?.compradorDoc === "string" ?
        req.body.compradorDoc :
        "9999999999999";

    const compradorTipoId =
      compradorDoc === "9999999999999" ? "07" : "05";

    const xml =
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
      "<factura id=\"comprobante\" version=\"1.0.0\">" +
      "<infoTributaria>" +
      `<ambiente>${ambiente}</ambiente>` +
      `<tipoEmision>${tipoEmision}</tipoEmision>` +
      `<razonSocial>${razonSocial}</razonSocial>` +
      `<nombreComercial>${nombreComercial}</nombreComercial>` +
      `<ruc>${ruc}</ruc>` +
      `<claveAcceso>${claveAcceso}</claveAcceso>` +
      `<codDoc>${codDoc}</codDoc>` +
      `<estab>${estab}</estab>` +
      `<ptoEmi>${ptoEmi}</ptoEmi>` +
      `<secuencial>${secuencial}</secuencial>` +
      "<dirMatriz>Quito</dirMatriz>" +
      "</infoTributaria>" +
      "<infoFactura>" +
      `<fechaEmision>${fechaEmision}</fechaEmision>` +
      "<dirEstablecimiento>Quito</dirEstablecimiento>" +
      `<obligadoContabilidad>${obligadoContabilidad}</obligadoContabilidad>` +
      "<tipoIdentificacionComprador>" +
      `${compradorTipoId}</tipoIdentificacionComprador>` +
      `<razonSocialComprador>${compradorNombre}</razonSocialComprador>` +
      `<identificacionComprador>${compradorDoc}</identificacionComprador>` +
      "<totalSinImpuestos>10.00</totalSinImpuestos>" +
      "<totalDescuento>0.00</totalDescuento>" +
      "<totalConImpuestos>" +
      "<totalImpuesto>" +
      "<codigo>2</codigo>" +
      "<codigoPorcentaje>0</codigoPorcentaje>" +
      "<baseImponible>10.00</baseImponible>" +
      "<valor>0.00</valor>" +
      "</totalImpuesto>" +
      "</totalConImpuestos>" +
      "<propina>0.00</propina>" +
      "<importeTotal>10.00</importeTotal>" +
      "<moneda>DOLAR</moneda>" +
      "</infoFactura>" +
      "<detalles>" +
      "<detalle>" +
      "<codigoPrincipal>SERV001</codigoPrincipal>" +
      "<descripcion>SERVICIO</descripcion>" +
      "<cantidad>1.00</cantidad>" +
      "<precioUnitario>10.00</precioUnitario>" +
      "<descuento>0.00</descuento>" +
      "<precioTotalSinImpuesto>10.00</precioTotalSinImpuesto>" +
      "<impuestos>" +
      "<impuesto>" +
      "<codigo>2</codigo>" +
      "<codigoPorcentaje>0</codigoPorcentaje>" +
      "<tarifa>0</tarifa>" +
      "<baseImponible>10.00</baseImponible>" +
      "<valor>0.00</valor>" +
      "</impuesto>" +
      "</impuestos>" +
      "</detalle>" +
      "</detalles>" +
      "</factura>";

    res.json({
      ok: true,
      claveAcceso,
      xml,
      xmlB64: Buffer.from(xml, "utf8").toString("base64"),
    });
  } catch (e: unknown) {
    logger.error("buildInvoiceXml error", e);
    res.status(500).json({
      ok: false,
      error: e instanceof Error ? e.message : "Error",
    });
  }
});
