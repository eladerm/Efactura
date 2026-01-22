import { customers } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/customers/columns';
import { Card, CardContent } from '@/components/ui/card';

export default function CustomersPage() {
  return (
    <div>
      <PageHeader title="Customers">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
            <DataTable columns={columns} data={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
