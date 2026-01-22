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
      <PageHeader title="Settings" />
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>SRI Configuration</CardTitle>
            <CardDescription>
              Configure parameters for communication with the SRI. This is only
              accessible to administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sri-environment">Environment</Label>
              <Select defaultValue="test">
                <SelectTrigger id="sri-environment">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">1 - Pruebas (Test)</SelectItem>
                  <SelectItem value="production">
                    2 - Producción (Production)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishment">Establishment</Label>
                <Input
                  id="establishment"
                  placeholder="001"
                  defaultValue="001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emission-point">Emission Point</Label>
                <Input
                  id="emission-point"
                  placeholder="001"
                  defaultValue="001"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Certificate</CardTitle>
            <CardDescription>
              Upload your .p12 file for signing electronic documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p12-file">.p12 Certificate File</Label>
              <Input id="p12-file" type="file" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="certificate-password">Certificate Password</Label>
                <Input id="certificate-password" type="password" placeholder="Enter password"/>
              </div>
          </CardContent>
           <CardFooter>
            <Button>Upload Certificate</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
