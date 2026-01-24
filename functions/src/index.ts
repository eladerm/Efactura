import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as cors from "cors";

// Inicializa el middleware de CORS para permitir peticiones desde cualquier origen.
const corsHandler = cors({origin: true});

/**
 * Pad con ceros a la izquierda.
 */
function zpad(val: string | number, len: number): string {
  return String(val).padStart(len, "0");
}

/**
 * Genera clave de acceso SRI (49 dígitos) para FACTURA (codDoc 01).
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


// --- FUNCIONES DE PRUEBA ---

// 1. ping: Verifica conectividad básica con el backend.
export const ping = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("ping ok");
    res.json({ok: true, message: "El backend de funciones está respondiendo."});
  });
});

// 2. sriPing: Simula una conexión con los servicios del SRI.
export const sriPing = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("sriPing mock ok");
    res.json({ok: true, message: "Conexión simulada con SRI exitosa (WSDL de recepción y autorización).", environment: "pruebas"});
  });
});

// 3. checkP12: Simula la lectura del certificado desde GCS.
export const checkP12 = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("checkP12 mock ok");
    res.json({ok: true, message: "Simulación: Certificado P12 encontrado y leído desde Cloud Storage."});
  });
});

// 4. testP12Secret: Simula la lectura de la contraseña desde Secret Manager.
export const testP12Secret = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("testP12Secret mock ok");
    res.json({ok: true, message: "Simulación: Secreto de la contraseña del P12 leído desde Secret Manager."});
  });
});

// 5. signXmlTest: Simula la firma de un XML de prueba.
export const signXmlTest = onRequest((req, res) => {
  corsHandler(req, res, () => {
    logger.info("signXmlTest mock ok");
    res.json({ok: true, message: "Simulación: XML de prueba firmado correctamente."});
  });
});

// 6. sriSendTest: Simula el envío de un comprobante al SRI.
export const sriSendTest = onRequest((req, res) => {
  corsHandler(req, res, () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    logger.info("sriSendTest mock ok", req.body);
    res.json({
      ok: true,
      sri_response: {
        estado: "RECIBIDA",
        comprobantes: {
          comprobante: {
            claveAcceso: "1234567890123456789012345678901234567890123456789",
            mensajes: {},
          },
        },
      },
    });
  });
});

// 7. buildInvoiceXml: Genera un XML de factura con datos de prueba.
export const buildInvoiceXml = onRequest((req, res) => {
  corsHandler(req, res, () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const razonSocial = "ELAPIEL";
      const nombreComercial = "ELAPIEL";
      const ruc = "1725885485001";
      const obligadoContabilidad = "NO";
      const ambiente = "1"; // Pruebas
      const tipoEmision = "1";
      const codDoc = "01";
      const estab = "001";
      const ptoEmi = "001";
      const secuencial = zpad(Math.floor(Math.random() * 999999999), 9);
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
        compradorDoc === "9999999999999" ? "07" : (compradorDoc.length === 13 ? "04" : "05");

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
        `<tipoIdentificacionComprador>${compradorTipoId}</tipoIdentificacionComprador>` +
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
        "<descripcion>SERVICIO DE PRUEBA</descripcion>" +
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
});
