"use client"

import { useState, useEffect } from "react"
import type { Product, InvoiceItem } from "@/types"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface InvoiceFormItemsProps {
  onItemsChange: (items: InvoiceItem[], totals: { subtotal: number, tax: number, total: number }) => void;
}

export function InvoiceFormItems({ onItemsChange }: InvoiceFormItemsProps) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { product: products[0], quantity: 1, discount: 0 },
  ])

  useEffect(() => {
    const subtotal = items.reduce((acc, item) => {
      const itemPrice = item.product.price * item.quantity;
      const discountAmount = itemPrice * (item.discount / 100);
      return acc + (itemPrice - discountAmount);
    }, 0)

    const tax = items.reduce((acc, item) => {
        const itemPrice = item.product.price * item.quantity;
        const discountAmount = itemPrice * (item.discount / 100);
        const finalPrice = itemPrice - discountAmount;
        return acc + (finalPrice * item.product.taxRate);
    }, 0)

    const total = subtotal + tax;
    onItemsChange(items, { subtotal, tax, total });
  }, [items, onItemsChange])

  const handleAddItem = () => {
    setItems([...items, { product: products[0], quantity: 1, discount: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem | "productId", value: any) => {
    const newItems = [...items];
    if (field === "productId") {
        const product = products.find(p => p.id === value);
        if(product) {
            newItems[index].product = product;
        }
    } else if (field === "quantity" || field === "discount") {
        (newItems[index] as any)[field] = Number(value);
    }
    setItems(newItems);
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5">Ítem</TableHead>
            <TableHead>Cant.</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Descuento (%)</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const itemTotal = item.product.price * item.quantity * (1 - item.discount / 100);
            return (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={item.product.id}
                    onValueChange={(value) => handleItemChange(index, "productId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-20"
                    min="1"
                  />
                </TableCell>
                <TableCell className="font-mono">
                    {item.product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                </TableCell>
                <TableCell className="text-right font-mono">
                    {itemTotal.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button variant="outline" onClick={handleAddItem}>
        Añadir Ítem
      </Button>
    </div>
  )
}
