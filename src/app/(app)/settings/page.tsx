'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/storage/file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Save, Key, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SettingsPage() {
  const { toast } = useToast();
  const [certConfig, setCertConfig] = useState({
    url: '',
    password: ''
  });

  // Cargar configuración de sesión si existe (para propósitos de demo)
  useEffect(() => {
    const savedUrl = localStorage.getItem('sri_p12_url') || '';
    const savedPass = localStorage.getItem('sri_p12_pass') || '';
    setCertConfig({ url: savedUrl, password: savedPass });
  }, []);

  const handleSaveCert = () => {
    localStorage.setItem('sri_p12_url', certConfig.url);
    localStorage.setItem('sri_p12_pass', certConfig.password);
    
    toast({
      title: "Certificado Configurado",
      description: "La URL y contraseña se han guardado para tus pruebas de facturación.",
    });
  };

  const handleSaveGeneral = () => {
    toast({
      title: "Configuración Guardada",
      description: "Los cambios generales han sido aplicados correctamente.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Configuración" />
      
      <div className="grid gap-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card h-full">
                <CardHeader>
                    <CardTitle className="text-xl">Datos de la Empresa</CardTitle>
                    <CardDescription>
                    Configura el correo de envío y el logo para tus facturas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="sender-email">Correo Electrónico de Envío</Label>
                    <Input
                        id="sender-email"
                        type="email"
                        placeholder="facturacion@elapiel.com"
                        defaultValue="facturacion@elapiel.com"
                        className="bg-white/50"
                    />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Remitente de comprobantes electrónicos.
                    </p>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="logo-upload">Logo Institucional</Label>
                    <FileUpload id="logo-upload" uploadPath="logos" accept="image/png, image/jpeg" />
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    <Button onClick={handleSaveGeneral} className="w-full bg-accent hover:bg-accent/90">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Datos Generales
                    </Button>
                </CardFooter>
            </Card>

            <Card className="glass-card h-full">
                <CardHeader>
                    <CardTitle className="text-xl">Configuración SRI</CardTitle>
                    <CardDescription>
                    Ambiente y códigos de establecimiento.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="sri-environment">Ambiente de Operación</Label>
                    <Select defaultValue="test">
                        <SelectTrigger id="sri-environment" className="bg-white/50">
                        <SelectValue placeholder="Selecciona un ambiente" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="test">1 - Pruebas (SRI Celcer)</SelectItem>
                        <SelectItem value="production">2 - Producción (SRI Cel)</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="establishment">Establecimiento</Label>
                        <Input id="establishment" placeholder="001" defaultValue="001" className="bg-white/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emission-point">Punto Emisión</Label>
                        <Input id="emission-point" placeholder="001" defaultValue="001" className="bg-white/50" />
                    </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                     <Button onClick={handleSaveGeneral} variant="outline" className="w-full border-accent/20 hover:bg-accent/5">
                        <Save className="mr-2 h-4 w-4" />
                        Actualizar Ambiente
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <Card className="glass-card border-accent/30 shadow-lg shadow-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Key className="h-6 w-6 text-accent" />
                    Firma Electrónica (.p12)
                </CardTitle>
                <CardDescription>
                Configura tu certificado para la firma legal de facturas.
                </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/5">
                <Link href="/dashboard/pruebas">
                    Ir al Laboratorio SRI
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
              <Alert className="bg-accent/5 border-accent/20">
                <Terminal className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent font-bold">Instrucciones</AlertTitle>
                <AlertDescription className="text-sm">
                    1. Sube tu archivo .p12 usando el selector de abajo.<br />
                    2. Copia la <strong>URL de descarga</strong> que aparecerá después de subirlo.<br />
                    3. Pégala en el campo <strong>URL del Certificado</strong> y guarda.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Label className="text-md font-bold">Subida de Archivo</Label>
                    <FileUpload id="cert-upload" uploadPath="certs" accept=".p12" />
                </div>
                
                <div className="space-y-4">
                    <Label className="text-md font-bold">Configuración de Firma</Label>
                    <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="space-y-2">
                            <Label htmlFor="p12-url-config">URL del Certificado</Label>
                            <Input 
                                id="p12-url-config" 
                                placeholder="https://firebasestorage.googleapis.com/..." 
                                value={certConfig.url}
                                onChange={e => setCertConfig(prev => ({...prev, url: e.target.value}))}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="p12-pass-config">Contraseña de Firma</Label>
                            <Input 
                                id="p12-pass-config" 
                                type="password" 
                                placeholder="Ingresa la clave de tu .p12"
                                value={certConfig.password}
                                onChange={e => setCertConfig(prev => ({...prev, password: e.target.value}))}
                                className="bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
            <Button onClick={handleSaveCert} size="lg" className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl">
              <Save className="mr-2 h-5 w-5" />
              Guardar Configuración de Firma
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
