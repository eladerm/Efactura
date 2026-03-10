'use server';

import { 
    generateInvoice, 
    generateInvoiceXml, 
    getP12FromUrl,
    signXml,
    documentReception,
    documentAuthorization
} from "open-factura";
import { format } from "date-fns";
import soap from 'soap';

// --- HELPERS ---

function getDummyInvoiceData(comprador?: { nombre: string, doc: string }) {
    const customer = {
        name: comprador?.nombre || 'Consumidor Final',
        identifier: comprador?.doc || '9999999999999'
    };

    const infoTributaria = {
        ambiente: "1", // 1 (Pruebas)
        tipoEmision: "1",
        razonSocial: "ELAPIEL S.A. (Pruebas)",
        nombreComercial: "Elapiel eFactura (Pruebas)",
        ruc: "1725885485001", // RUC de prueba para ELAPIEL
        claveAcceso: "",
        codDoc: "01",
        estab: "001",
        ptoEmi: "001",
        secuencial: new Date().getTime().toString().slice(-9).padStart(9, '0'),
        dirMatriz: "AV. 9 DE OCTUBRE Y MALECON, GUAYAQUIL",
    };

    const infoFactura = {
        fechaEmision: format(new Date(), 'dd/MM/yyyy'),
        dirEstablecimiento: "AV. 9 DE OCTUBRE Y MALECON, GUAYAQUIL",
        obligadoContabilidad: "SI",
        tipoIdentificacionComprador: customer.identifier.length === 13 ? '04' : (customer.identifier.length === 10 ? '05' : '07'),
        razonSocialComprador: customer.name,
        identificacionComprador: customer.identifier,
        totalSinImpuestos: 10.00,
        totalDescuento: 0,
        totalConImpuestos: {
            totalImpuesto: [{
                codigo: '2',
                codigoPorcentaje: '0', // 0% para pruebas iniciales
                baseImponible: 10.00,
                valor: 0.00,
            }]
        },
        propina: 0,
        importeTotal: 10.00,
        moneda: "DOLAR",
        pagos: { pago: [{ formaPago: '01', total: 10.00 }] }
    };

    const detalles = {
        detalle: [{
            codigoPrincipal: 'TEST-001',
            descripcion: 'Producto de Prueba ELAPIEL',
            cantidad: 1,
            precioUnitario: 10.00,
            descuento: 0,
            precioTotalSinImpuesto: 10.00,
            impuestos: {
                impuesto: [{
                    codigo: '2',
                    codigoPorcentaje: '0',
                    tarifa: 0,
                    baseImponible: 10.00,
                    valor: 0.00
                }]
            }
        }]
    };

    return { infoTributaria, infoFactura, detalles };
}

async function signDummyXml(unsignedXml: string, customUrl?: string, customPass?: string) {
    const p12Url = customUrl || process.env.P12_URL;
    const p12Password = customPass || process.env.P12_PASSWORD;

    if (!p12Url || !p12Password) {
        throw new Error("Faltan credenciales P12 (URL o Contraseña). Configúralas en la página de Configuración.");
    }
    const p12Buffer = await getP12FromUrl(p12Url);
    return signXml(p12Buffer, p12Password, unsignedXml);
}

const sriTestEndpoints = {
    reception: "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl",
    authorization: "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl"
};

// --- TEST ACTIONS ---

export async function pingTest() {
    return { ok: true, message: "Pong! El backend de Server Actions está respondiendo." };
}

export async function sriPingTest() {
    try {
        const client = await soap.createClientAsync(sriTestEndpoints.reception);
        if(!client) throw new Error('No se pudo crear el cliente SOAP para Recepción.');
        const clientAuth = await soap.createClientAsync(sriTestEndpoints.authorization);
        if(!clientAuth) throw new Error('No se pudo crear el cliente SOAP para Autorización.');

        return { ok: true, message: "Conexión con WSDL de Recepción y Autorización del SRI (Pruebas) exitosa." };
    } catch (e: any) {
        return { ok: false, error: `Fallo al conectar con WSDL del SRI: ${e.message}` };
    }
}

export async function checkP12Test(url?: string) {
    const p12Url = url || process.env.P12_URL;
    if (!p12Url) {
        return { ok: false, error: "La URL del certificado P12 no está configurada." };
    }
    try {
        const p12Buffer = await getP12FromUrl(p12Url);
        return { ok: true, message: `Certificado P12 leído correctamente. Tamaño: ${p12Buffer.byteLength} bytes.` };
    } catch (e: any) {
        return { ok: false, error: `No se pudo leer el certificado: ${e.message}` };
    }
}

export async function testP12SecretTest(pass?: string) {
     const p12Password = pass || process.env.P12_PASSWORD;
    if (!p12Password) {
        return { ok: false, error: "La contraseña del P12 no está configurada." };
    }
    return { ok: true, message: "La contraseña está presente y lista para usar." };
}

export async function signXmlTest(url?: string, pass?: string) {
     try {
        const { invoice } = generateInvoice(getDummyInvoiceData());
        const unsignedXml = generateInvoiceXml(invoice);
        const signedXml = await signDummyXml(unsignedXml, url, pass);
        return { ok: true, message: "XML de prueba generado y firmado exitosamente.", signedXml: signedXml.toString('base64') };
    } catch (e: any) {
        return { ok: false, error: `Error durante la firma: ${e.message}` };
    }
}

export async function buildInvoiceXmlTest(comprador: { nombre: string, doc: string }) {
    try {
        const { invoice, accessKey } = generateInvoice(getDummyInvoiceData(comprador));
        const xml = generateInvoiceXml(invoice);
        return { 
            ok: true, 
            claveAcceso: accessKey, 
            xmlB64: Buffer.from(xml).toString('base64') 
        };
    } catch (e: any) {
        return { ok: false, error: `Error al generar XML: ${e.message}` };
    }
}

export async function sriSendTest(body: { xmlB64: string, p12Url?: string, p12Pass?: string }) {
    try {
        if(!body.xmlB64) throw new Error("xmlB64 no fue proporcionado.");

        const unsignedXml = Buffer.from(body.xmlB64, 'base64').toString('utf8');
        const signedXml = await signDummyXml(unsignedXml, body.p12Url, body.p12Pass);
        
        const receptionResult = await documentReception(signedXml, sriTestEndpoints.reception);

        if (receptionResult.estado !== 'RECIBIDA') {
             return { ok: false, error: `El SRI no recibió la factura. Estado: ${receptionResult.estado}`, sri_response: receptionResult };
        }
        
        return { ok: true, sri_response: receptionResult };
    } catch (e: any) {
        return { ok: false, error: e.message };
    }
}

export async function sriAuthorizeTest(body: { claveAcceso: string }) {
     try {
        if(!body.claveAcceso) throw new Error("claveAcceso no fue proporcionada.");
        
        const authorizationResult = await documentAuthorization(body.claveAcceso, sriTestEndpoints.authorization);
        const auth = authorizationResult.autorizaciones?.autorizacion?.[0];

        if (!auth || auth.estado !== 'AUTORIZADO') {
             return { ok: false, error: `La factura no fue autorizada. Estado: ${auth?.estado || 'DESCONOCIDO'}`, sri_response: authorizationResult };
        }
        
        return { ok: true, sri_response: authorizationResult };
    } catch (e: any) {
        return { ok: false, error: e.message };
    }
}
