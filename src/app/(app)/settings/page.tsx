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
import { Terminal } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configuración" />
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Empresa</CardTitle>
            <CardDescription>
              Configura el correo de envío y el logo para tus facturas. Estos cambios se reflejarán en futuros documentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sender-email">Correo Electrónico de Envío</Label>
              <Input
                id="sender-email"
                type="email"
                placeholder="facturacion@tuempresa.com"
              />
              <p className="text-xs text-muted-foreground pt-1">
                Este correo se usará como remitente al enviar las facturas a tus clientes.
              </p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo de la Empresa</Label>
              <FileUpload id="logo-upload" uploadPath="logos" accept="image/png, image/jpeg" />
               <p className="text-xs text-muted-foreground pt-1">
                Sube el logo que aparecerá en tus facturas. Se recomienda un archivo PNG o JPG.
              </p>
            </div>
          </CardContent>
           <CardFooter>
            <Button disabled>Guardar Cambios</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración SRI</CardTitle>
            <CardDescription>
              Parámetros para la comunicación con el SRI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sri-environment">Ambiente</Label>
              <Select defaultValue="test">
                <SelectTrigger id="sri-environment">
                  <SelectValue placeholder="Selecciona un ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">1 - Pruebas</SelectItem>
                  <SelectItem value="production">
                    2 - Producción
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pt-1">
                El ambiente se controla a través de la variable de entorno `SRI_ENVIRONMENT`.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishment">Establecimiento</Label>
                <Input
                  id="establishment"
                  placeholder="001"
                  defaultValue="001"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emission-point">Punto de Emisión</Label>
                <Input
                  id="emission-point"
                  placeholder="001"
                  defaultValue="001"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled>Guardar Cambios</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificado Digital</CardTitle>
            <CardDescription>
              Sube tu certificado .p12 para la firma electrónica y configura las variables de entorno necesarias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuración Requerida</AlertTitle>
                <AlertDescription>
                    <p>
                    Para firmar facturas, debes configurar dos variables de entorno en tu servicio de hosting (ej. Firebase App Hosting):
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-xs">
                        <li><span className="font-semibold">P12_URL</span>: La URL de tu archivo .p12 subido a Storage.</li>
                        <li><span className="font-semibold">P12_PASSWORD</span>: La contraseña de tu certificado.</li>
                    </ul>
                </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="cert-upload">Sube tu certificado (.p12)</Label>
              <FileUpload id="cert-upload" uploadPath="certs" accept=".p12" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
