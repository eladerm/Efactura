'use client';

import { useState, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { customers } from '@/lib/data';
import type { InvoiceItem } from '@/types';
import { InvoiceFormItems } from '@/components/invoices/invoice-form-items';
import { Separator } from '@/components/ui/separator';
import { createInvoice } from '@/app/actions/invoices';

export default function NewInvoicePage() {
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [customerId, setCustomerId] = useState<string | undefined>();
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');

    const handleItemsChange = useCallback((newItems: InvoiceItem[], newTotals: { subtotal: number, tax: number, total: number }) => {
        setItems(newItems);
        setTotals(newTotals);
    }, []);

  return (
    <form action={createInvoice}>
      <PageHeader title="Nueva Factura" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
            {/* Customer Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Cliente</CardTitle>
                    <CardDescription>Selecciona el cliente para esta factura.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="customer">Cliente</Label>
                        <Select name="customerId" onValueChange={setCustomerId} required>
                            <SelectTrigger id="customer">
                            <SelectValue placeholder="Selecciona un cliente" />
                            </SelectTrigger>
                            <SelectContent>
                            {customers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name} - {customer.identifier}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Items Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Ítems de la Factura</CardTitle>
                    <CardDescription>Añade productos o servicios a la factura.</CardDescription>
                </CardHeader>
                <CardContent>
                    <InvoiceFormItems onItemsChange={handleItemsChange} />
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Hidden inputs for form submission */}
                    <input type="hidden" name="items" value={JSON.stringify(items.map(i => ({productId: i.product.id, quantity: i.quantity, discount: i.discount})))} />
                    <input type="hidden" name="subtotal" value={totals.subtotal} />
                    <input type="hidden" name="tax" value={totals.tax} />
                    <input type="hidden" name="total" value={totals.total} />

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Impuestos (15%)</span>
                        <span className="font-mono">${totals.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="font-mono">${totals.total.toFixed(2)}</span>
                    </div>
                    <Separator />
                     <div className="grid gap-2">
                        <Label htmlFor="payment-method">Método de Pago</Label>
                        <Select name="paymentMethod" value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger id="payment-method">
                                <SelectValue placeholder="Selecciona un método de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Sin utilización del sistema financiero</SelectItem>
                                <SelectItem value="card">Tarjeta de Crédito/Débito</SelectItem>
                                <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                                <SelectItem value="other">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90" disabled={!customerId || items.length === 0}>
                        Crear y Emitir Factura
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </form>
  );
}
