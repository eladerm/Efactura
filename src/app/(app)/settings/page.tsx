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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishment">Establecimiento</Label>
                <Input
                  id="establishment"
                  placeholder="001"
                  defaultValue="001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emission-point">Punto de Emisión</Label>
                <Input
                  id="emission-point"
                  placeholder="001"
                  defaultValue="001"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Guardar Cambios</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificado Digital</CardTitle>
            <CardDescription>
              Sube tu archivo .p12 para firmar documentos electrónicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p12-file">Archivo de Certificado .p12</Label>
              <Input id="p12-file" type="file" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="certificate-password">Contraseña del Certificado</Label>
                <Input id="certificate-password" type="password" placeholder="Ingresa la contraseña"/>
              </div>
          </CardContent>
           <CardFooter>
            <Button>Subir Certificado</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
