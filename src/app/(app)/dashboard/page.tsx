import { DollarSign, FileText, Users, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function DashboardPage() {
  const isSignatureConfigured = !!(process.env.P12_URL && process.env.P12_PASSWORD);

  return (
    <div>
      {!isSignatureConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración de Firma Incompleta</AlertTitle>
          <AlertDescription>
            Para emitir facturas, es necesario configurar tu certificado digital.
            Asegúrate de que las variables de entorno `P12_URL` y `P12_PASSWORD` estén configuradas.
            <Link href="/settings" className="font-bold underline ml-1">
              Ir a Configuración para más detalles.
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <PageHeader title="Tablero" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Ingresos Totales"
          value="$45,231.89"
          description="+20.1% desde el mes pasado"
          Icon={DollarSign}
        />
        <StatCard
          title="Facturas Autorizadas"
          value="+2350"
          description="+180.1% desde el mes pasado"
          Icon={FileText}
        />
        <StatCard
          title="Nuevos Clientes"
          value="+12"
          description="+19% desde el mes pasado"
          Icon={Users}
        />
        <StatCard
          title="Pendientes de Autorización"
          value="15"
          description="Esperando respuesta del SRI"
          Icon={AlertCircle}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
            <RecentInvoices />
        </div>
      </div>
    </div>
  );
}
