'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TestCard } from '@/components/pruebas/TestCard';
import type { TestExecution, TestName, TestStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from '@/components/pruebas/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Key, ShieldCheck, Play, Loader2, Settings, ArrowRight } from 'lucide-react';
import { buildInvoiceXmlTest, checkP12Test, pingTest, signXmlTest, sriAuthorizeTest, sriPingTest, sriSendTest, testP12SecretTest } from '@/app/actions/sri-tests';
import Link from 'next/link';

const testsConfig: { name: TestName; title: string; description: string; }[] = [
    { name: "ping", title: "Ping a Server Actions", description: "Verifica conectividad básica con el backend de Next.js." },
    { name: "sriPing", title: "Ping a SRI", description: "Comprueba la conexión con los endpoints WSDL del SRI en ambiente de pruebas." },
    { name: "checkP12", title: "Verificar Certificado P12", description: "Confirma que el archivo .p12 se puede leer desde la URL proporcionada." },
    { name: "testP12Secret", title: "Verificar Contraseña", description: "Confirma que la contraseña del .p12 es válida para abrir el archivo." },
    { name: "signXmlTest", title: "Prueba de Firma de XML", description: "Realiza una firma de un XML de prueba con el certificado." },
];

export default function PruebasSriPage() {
    const [executions, setExecutions] = useState<Record<string, TestExecution>>({});
    const [history, setHistory] = useState<TestExecution[]>([]);
    const [comprador, setComprador] = useState({ nombre: "Consumidor Final", doc: "9999999999999" });
    const [credentials, setCredentials] = useState({ url: "", pass: "" });
    const [environment, setEnvironment] = useState("pruebas");

    // Cargar credenciales guardadas en Configuración
    useEffect(() => {
        const savedUrl = localStorage.getItem('sri_p12_url') || '';
        const savedPass = localStorage.getItem('sri_p12_pass') || '';
        if (savedUrl) setCredentials(prev => ({ ...prev, url: savedUrl }));
        if (savedPass) setCredentials(prev => ({ ...prev, pass: savedPass }));
    }, []);

    const addHistory = (execution: TestExecution) => {
        setHistory(prev => [execution, ...prev].slice(0, 10));
    };
    
    const handleRunTest = async (testName: TestName, body?: any): Promise<any> => {
        const start = Date.now();
        const executionId = `${testName}-${start}`;
        const initialExecution: TestExecution = {
            id: executionId,
            name: testName,
            status: "running",
            timestamp: format(start, "Pp", { locale: es }),
            result: null,
            duration: 0,
        };
        setExecutions(prev => ({ ...prev, [testName]: initialExecution }));
        addHistory(initialExecution);
        
        try {
            let result;
            switch(testName) {
                case 'ping': result = await pingTest(); break;
                case 'sriPing': result = await sriPingTest(); break;
                case 'checkP12': result = await checkP12Test(credentials.url); break;
                case 'testP12Secret': result = await testP12SecretTest(credentials.pass); break;
                case 'signXmlTest': result = await signXmlTest(credentials.url, credentials.pass); break;
                case 'buildInvoiceXml': result = await buildInvoiceXmlTest(body); break;
                case 'sriSendTest': result = await sriSendTest({ ...body, p12Url: credentials.url, p12Pass: credentials.pass }); break;
                case 'sriAuthorizeTest': result = await sriAuthorizeTest(body); break;
                default: throw new Error(`Test '${testName}' no implementado`);
            }

            if (!result.ok) {
                throw new Error(result.error || 'El test retornó un error no especificado.');
            }

            const duration = Date.now() - start;
            const finalExecution: TestExecution = { ...initialExecution, status: "success", result, duration };
            setExecutions(prev => ({ ...prev, [testName]: finalExecution }));
            setHistory(prev => prev.map(h => h.id === executionId ? finalExecution : h));
            return result;
        } catch (error: any) {
            const duration = Date.now() - start;
            const finalExecution: TestExecution = { ...initialExecution, status: "error", result: { error: error.message, stack: error.stack }, duration };
            setExecutions(prev => ({ ...prev, [testName]: finalExecution }));
            setHistory(prev => prev.map(h => h.id === executionId ? finalExecution : h));
            return null;
        }
    };
    
    const handleFullFlow = async () => {
        const start = Date.now();
        const executionId = `fullFlow-${start}`;
        const initialExecution: TestExecution = {
            id: executionId,
            name: "fullFlow",
            status: "running",
            timestamp: format(start, "Pp", { locale: es }),
            result: { steps: [] },
            duration: 0,
        };
        setExecutions(prev => ({ ...prev, fullFlow: initialExecution }));
        addHistory(initialExecution);

        const updateFlowState = (status: TestStatus, stepResult: any) => {
             setExecutions(prev => {
                const current = prev.fullFlow;
                if (!current) return prev;
                const newResult = {...current.result, steps: [...current.result.steps, stepResult]};
                const newExecution: TestExecution = {...current, status, result: newResult };
                setHistory(h => h.map(i => i.id === executionId ? newExecution : i));
                return {...prev, fullFlow: newExecution };
             });
        }
        
        // Step 1: Build XML
        const xmlResult = await handleRunTest("buildInvoiceXml", { compradorNombre: comprador.nombre, compradorDoc: comprador.doc });
        if (!xmlResult?.xmlB64) {
             updateFlowState("error", {step: "buildInvoiceXml", ok: false, error: "No se pudo generar el XML."});
             return;
        }
        updateFlowState("running", { step: "buildInvoiceXml", ok: true, claveAcceso: xmlResult.claveAcceso });
        
        // Step 2: Send to SRI (includes signing)
        const sendResult = await handleRunTest("sriSendTest", { xmlB64: xmlResult.xmlB64 });
        if (!sendResult || !sendResult.ok) {
            updateFlowState("error", {step: "sriSendTest", ok: false, error: sendResult?.error || "Fallo en el envío al SRI."});
            return;
        }
        updateFlowState("running", { step: "sriSendTest", ok: true, result: sendResult.sri_response });

        // Step 3: Authorize
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for SRI to process
        const authResult = await handleRunTest("sriAuthorizeTest", { claveAcceso: xmlResult.claveAcceso });
         if (!authResult || !authResult.ok) {
            updateFlowState("error", {step: "sriAuthorizeTest", ok: false, error: authResult?.error || "Fallo en la autorización."});
            return;
        }
        updateFlowState("success", { step: "sriAuthorizeTest", ok: true, result: authResult.sri_response });
        
        const duration = Date.now() - start;
        setExecutions(prev => ({...prev, fullFlow: {...prev.fullFlow, duration, status: "success"}}));
    };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Laboratorio SRI" />
        <Button asChild variant="outline" className="border-accent/20 hover:bg-accent/5">
            <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Firma
            </Link>
        </Button>
      </div>
      
      <Card className="border-accent/30 bg-accent/5 shadow-sm">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-accent" />
                Credenciales de Firma para Pruebas
            </CardTitle>
            <CardDescription className="text-foreground/70">
                Estas credenciales se utilizan para firmar los XML y enviarlos al SRI Celcer. 
                Pégalas desde <strong>Configuración</strong> o cárgalas manualmente aquí.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="p12-url" className="font-bold">URL del Certificado (.p12)</Label>
                <Input 
                    id="p12-url" 
                    placeholder="https://firebasestorage.googleapis.com/..." 
                    value={credentials.url}
                    onChange={e => setCredentials(c => ({...c, url: e.target.value}))}
                    className="bg-white border-accent/20 focus-visible:ring-accent"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="p12-pass" className="font-bold">Contraseña del Certificado</Label>
                <Input 
                    id="p12-pass" 
                    type="password" 
                    placeholder="Contraseña de tu certificado"
                    value={credentials.pass}
                    onChange={e => setCredentials(c => ({...c, pass: e.target.value}))}
                    className="bg-white border-accent/20 focus-visible:ring-accent"
                />
            </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-6 p-4 bg-muted/40 rounded-2xl border border-border/50">
        <Label className="font-bold">Modo de Entorno:</Label>
        <RadioGroup defaultValue="pruebas" className="flex items-center gap-6" onValueChange={setEnvironment} value={environment}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pruebas" id="r_pruebas" />
            <Label htmlFor="r_pruebas" className="cursor-pointer">SRI Celcer (Pruebas)</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                        <RadioGroupItem value="produccion" id="r_produccion" disabled />
                        <Label htmlFor="r_produccion">SRI Cel (Producción)</Label>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Bloqueado por seguridad en este laboratorio.</p>
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testsConfig.map(test => (
            <TestCard 
                key={test.name}
                title={test.title}
                description={test.description}
                onRun={() => handleRunTest(test.name)}
                execution={executions[test.name]}
            />
        ))}
      </div>

      <Separator className="my-8" />

      <h2 className="text-3xl font-black tracking-tighter font-headline text-foreground">Flujos Automatizados</h2>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-accent" />
                        Generar XML de Factura
                    </CardTitle>
                    <CardDescription>
                        Crea un XML con estructura legal 2.26 para pruebas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="compradorNombre">Nombre del Comprador</Label>
                        <Input id="compradorNombre" value={comprador.nombre} onChange={e => setComprador(c => ({...c, nombre: e.target.value}))} className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compradorDoc">RUC / Cédula</Label>
                        <Input id="compradorDoc" value={comprador.doc} onChange={e => setComprador(c => ({...c, doc: e.target.value}))} className="bg-white" />
                    </div>
                    {executions.buildInvoiceXml && (
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={executions.buildInvoiceXml.status} />
                          <span className="text-xs font-mono">{executions.buildInvoiceXml.timestamp}</span>
                        </div>
                        <pre className="p-3 bg-muted/50 rounded-xl text-[10px] overflow-auto max-h-40 font-mono">
                          {JSON.stringify(executions.buildInvoiceXml.result, null, 2)}
                        </pre>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                    <Button 
                      onClick={() => handleRunTest("buildInvoiceXml", { compradorNombre: comprador.nombre, compradorDoc: comprador.doc })}
                      disabled={executions.buildInvoiceXml?.status === "running"}
                      className="bg-primary text-white"
                    >
                      {executions.buildInvoiceXml?.status === "running" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Generar Comprobante
                    </Button>
                </CardFooter>
            </Card>

            <TestCard
                title="Flujo Completo SRI (Prueba Real)"
                description="Secuencia: Generar -> Firmar -> Enviar -> Autorizar."
                onRun={handleFullFlow}
                execution={executions["fullFlow"]}
            >
                <div className="space-y-3 pt-2">
                    {executions.fullFlow?.result?.steps?.map((step: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-muted/20 rounded-xl border border-border/50">
                            <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>
                            <span className="font-semibold text-sm flex-1">{step.step}</span>
                            {step.ok ? <StatusBadge status="success" /> : <StatusBadge status="error" />}
                        </div>
                    ))}
                    {executions.fullFlow?.status === "error" && (
                         <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-bold text-sm">El flujo se detuvo debido a un error.</span>
                        </div>
                    )}
                </div>
            </TestCard>
       </div>

      <Separator className="my-8" />

        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Historial de Ejecuciones</CardTitle>
                <CardDescription>Registro de las últimas 10 pruebas del laboratorio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No se han registrado actividades aún.</p>
                    ) : (
                        history.map(exec => (
                            <div key={exec.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={exec.status} />
                                    <div className="font-mono text-sm font-bold text-primary">{exec.name}</div>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                                    {exec.timestamp} ({exec.duration}ms)
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
