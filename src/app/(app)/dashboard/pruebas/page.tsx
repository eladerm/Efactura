'use client';

import { useState } from 'react';
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
import { AlertTriangle, Key, ShieldCheck, Play, Loader2 } from 'lucide-react';
import { buildInvoiceXmlTest, checkP12Test, pingTest, signXmlTest, sriAuthorizeTest, sriPingTest, sriSendTest, testP12SecretTest } from '@/app/actions/sri-tests';
import Link from 'next/link';

const testsConfig: { name: TestName; title: string; description: string; }[] = [
    { name: "ping", title: "Ping a Server Actions", description: "Verifica conectividad básica con el backend de Next.js." },
    { name: "sriPing", title: "Ping a SRI", description: "Comprueba la conexión con los endpoints WSDL del SRI en ambiente de pruebas." },
    { name: "checkP12", title: "Verificar Certificado P12", description: "Confirma que el archivo .p12 se puede leer desde la URL." },
    { name: "testP12Secret", title: "Verificar Contraseña", description: "Confirma que la contraseña del .p12 está configurada." },
    { name: "signXmlTest", title: "Prueba de Firma de XML", description: "Realiza una firma de un XML de prueba con el certificado." },
];

export default function PruebasSriPage() {
    const [executions, setExecutions] = useState<Record<string, TestExecution>>({});
    const [history, setHistory] = useState<TestExecution[]>([]);
    const [comprador, setComprador] = useState({ nombre: "Consumidor Final", doc: "9999999999999" });
    const [credentials, setCredentials] = useState({ url: "", pass: "" });
    const [environment, setEnvironment] = useState("pruebas");

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
      <PageHeader title="Pruebas de Integración SRI" />
      
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Credenciales de Prueba (Opcional)
            </CardTitle>
            <CardDescription>
                Si no has configurado las variables de entorno, puedes pegarlas aquí para realizar los tests.
                Sube tu .p12 en <Link href="/settings" className="underline font-semibold">Configuración</Link> primero.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="p12-url">URL del Certificado (.p12)</Label>
                <Input 
                    id="p12-url" 
                    placeholder="https://firebasestorage..." 
                    value={credentials.url}
                    onChange={e => setCredentials(c => ({...c, url: e.target.value}))}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="p12-pass">Contraseña del Certificado</Label>
                <Input 
                    id="p12-pass" 
                    type="password" 
                    placeholder="Tu contraseña"
                    value={credentials.pass}
                    onChange={e => setCredentials(c => ({...c, pass: e.target.value}))}
                />
            </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-6">
        <Label>Modo de Operación:</Label>
        <RadioGroup defaultValue="pruebas" className="flex items-center" onValueChange={setEnvironment} value={environment}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pruebas" id="r_pruebas" />
            <Label htmlFor="r_pruebas">Pruebas</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 opacity-50">
                        <RadioGroupItem value="produccion" id="r_produccion" disabled />
                        <Label htmlFor="r_produccion">Producción</Label>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Habilitar después de pasar todas las pruebas.</p>
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

      <Separator />

      <h2 className="text-2xl font-bold tracking-tight font-headline">Flujos de Prueba</h2>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Generar XML de Factura</CardTitle>
                    <CardDescription>
                        Crea un XML de factura con datos de prueba.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="compradorNombre">Nombre/Razón Social</Label>
                        <Input id="compradorNombre" value={comprador.nombre} onChange={e => setComprador(c => ({...c, nombre: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compradorDoc">CI/RUC</Label>
                        <Input id="compradorDoc" value={comprador.doc} onChange={e => setComprador(c => ({...c, doc: e.target.value}))} />
                    </div>
                    {executions.buildInvoiceXml && (
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={executions.buildInvoiceXml.status} />
                          <span className="text-xs font-mono">{executions.buildInvoiceXml.timestamp}</span>
                        </div>
                        <pre className="p-2 bg-muted rounded text-[10px] overflow-auto max-h-40">
                          {JSON.stringify(executions.buildInvoiceXml.result, null, 2)}
                        </pre>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => handleRunTest("buildInvoiceXml", { compradorNombre: comprador.nombre, compradorDoc: comprador.doc })}
                      disabled={executions.buildInvoiceXml?.status === "running"}
                    >
                      {executions.buildInvoiceXml?.status === "running" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Ejecutar Generación
                    </Button>
                </CardFooter>
            </Card>

            <TestCard
                title="Flujo Completo: Generar -> Firmar -> Enviar -> Autorizar"
                description="Ejecuta la secuencia completa en el ambiente de pruebas del SRI."
                onRun={handleFullFlow}
                execution={executions["fullFlow"]}
            >
                <div className="space-y-2">
                    {executions.fullFlow?.result?.steps?.map((step: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 dark:bg-muted/20 rounded-md">
                            <span className="font-semibold text-sm">{index + 1}. {step.step}</span>
                            {step.ok ? <StatusBadge status="success" /> : <StatusBadge status="error" />}
                            <span className="text-xs text-muted-foreground truncate">{step.claveAcceso || step.error || 'OK'}</span>
                        </div>
                    ))}
                    {executions.fullFlow?.status === "error" && (
                         <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-md text-red-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-semibold text-sm">Flujo detenido por error.</span>
                        </div>
                    )}
                </div>
            </TestCard>
       </div>

      <Separator />

        <Card>
            <CardHeader>
                <CardTitle>Historial de Ejecuciones</CardTitle>
                <CardDescription>Últimas 10 pruebas ejecutadas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No se han ejecutado pruebas aún.</p>
                    ) : (
                        history.map(exec => (
                            <div key={exec.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={exec.status} />
                                    <div className="font-mono text-sm">{exec.name}</div>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
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
