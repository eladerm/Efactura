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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configuración" />
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Configuración SRI</CardTitle>
            <CardDescription>
              Configura los parámetros para la comunicación con el SRI. Solo accesible para administradores.
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
                Actualmente, el ambiente se controla a través de la variable de entorno `SRI_ENVIRONMENT`.
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
              Configuración del certificado para la firma electrónica de los documentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuración por Variables de Entorno</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Para firmar facturas, debes configurar las siguientes variables de entorno en tu proveedor de hosting:</p>
                    <code className="block w-full whitespace-pre-wrap rounded-md bg-muted p-2 text-xs font-mono">
                      P12_URL=https://.../tu-certificado.p12<br />
                      P12_PASSWORD=tu-contraseña
                    </code>
                    <p className="text-xs text-muted-foreground">
                      El sistema actual no permite la subida directa del archivo por seguridad. El archivo debe ser alojado en un lugar seguro (como Firebase Storage) y su URL debe ser proveída.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
