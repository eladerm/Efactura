import { getFullInvoices } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/invoices/columns';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function InvoicesPage() {
    const invoices = getFullInvoices();
  return (
    <div>
      <PageHeader title="Invoices">
        <Button asChild>
          <Link href="/invoices/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
            <DataTable columns={columns} data={invoices} />
        </CardContent>
      </Card>
    </div>
  );
}
