import { DollarSign, FileCheck, Users, Clock, ArrowUpRight, Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <PageHeader title="Panel de Control" />
          <p className="text-muted-foreground -mt-6">Bienvenido de nuevo. Aquí tienes un resumen de tu actividad hoy.</p>
        </div>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white btn-elegant rounded-2xl px-8 h-12">
          <Link href="/invoices/new">
            <Plus className="mr-2 h-5 w-5" />
            Emitir Factura
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Mensuales"
          value="$12,845.00"
          description="Incremento del 12% vs el mes pasado"
          Icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Facturas Emitidas"
          value="452"
          description="Comprobantes autorizados SRI"
          Icon={FileCheck}
          trend="up"
        />
        <StatCard
          title="Clientes Nuevos"
          value="14"
          description="Registrados este mes"
          Icon={Users}
          trend="up"
        />
        <StatCard
          title="Pendientes SRI"
          value="8"
          description="Esperando autorización"
          Icon={Clock}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4 h-full">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3 h-full">
          <RecentInvoices />
        </div>
      </div>
    </div>
  );
}