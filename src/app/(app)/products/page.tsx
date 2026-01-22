import { products } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/products/columns';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products & Services">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
            <DataTable columns={columns} data={products} />
        </CardContent>
      </Card>
    </div>
  );
}
