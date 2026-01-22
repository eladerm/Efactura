import type { Customer, Product, Invoice } from "@/types";

export const customers: Customer[] = [
  { id: "CUS-001", name: "Consumidor Final", identifier: "9999999999999", email: "consumidor@final.com", phone: "N/A", address: "N/A" },
  { id: "CUS-002", name: "Tech Solutions S.A.", identifier: "0987654321001", email: "contact@techsolutions.com", phone: "04-234-5678", address: "Av. Principal 123, Guayaquil" },
  { id: "CUS-003", name: "Innovate Corp.", identifier: "1723456789001", email: "info@innovate.corp", phone: "02-298-7654", address: "Calle Secundaria 456, Quito" },
  { id: "CUS-004", name: "Maria Rodriguez", identifier: "0912345678", email: "maria.r@email.com", phone: "098-765-4321", address: "Cdla. Las Acacias, Mz. A, Villa 5" },
  { id: "CUS-005", name: "Global Exports", identifier: "0987654322001", email: "exports@global.net", phone: "04-212-3456", address: "Km 5 Via a la Costa, Guayaquil" },
];

export const products: Product[] = [
  { id: "PROD-001", code: "SRV-CONS", name: "Servicios de Consultoría", price: 150.00, taxRate: 0.15 },
  { id: "PROD-002", code: "PROD-LAP", name: "Laptop Pro 15 pulgadas", price: 1200.00, taxRate: 0.15 },
  { id: "PROD-003", code: "PROD-MOUSE", name: "Mouse Inalámbrico", price: 25.00, taxRate: 0.15 },
  { id: "PROD-004", code: "SRV-WEB", name: "Desarrollo Web (por hora)", price: 80.00, taxRate: 0.15 },
  { id: "PROD-005", code: "PROD-KEYB", name: "Teclado Mecánico", price: 75.00, taxRate: 0.15 },
  { id: "PROD-006", code: "SRV-MAINT", name: "Plan de Mantenimiento Mensual", price: 200.00, taxRate: 0.15 },
];

export const invoices: Omit<Invoice, 'customer' | 'items'>[] & { customerId: string, itemIds: {productId: string, quantity: number, discount: number}[] } = [
  { id: "INV-001", invoiceNumber: "001-001-000000001", customerId: "CUS-002", issueDate: "2023-10-26", total: 172.50, status: "Autorizada", itemIds: [{ productId: "PROD-001", quantity: 1, discount: 0 }] },
  { id: "INV-002", invoiceNumber: "001-001-000000002", customerId: "CUS-003", issueDate: "2023-10-27", total: 1402.50, status: "Enviada", itemIds: [{ productId: "PROD-002", quantity: 1, discount: 0 }, { productId: "PROD-003", quantity: 1, discount: 0 }] },
  { id: "INV-003", invoiceNumber: "001-001-000000003", customerId: "CUS-004", issueDate: "2023-10-28", total: 86.25, status: "No Autorizada", itemIds: [{ productId: "PROD-005", quantity: 1, discount: 0 }] },
  { id: "INV-004", invoiceNumber: "001-001-000000004", customerId: "CUS-005", issueDate: "2023-10-29", total: 184.00, status: "Generada", itemIds: [{ productId: "PROD-004", quantity: 2, discount: 0 }] },
  { id: "INV-005", invoiceNumber: "001-001-000000005", customerId: "CUS-002", issueDate: "2023-10-30", total: 230.00, status: "Anulada", itemIds: [{ productId: "PROD-006", quantity: 1, discount: 0 }] },
  { id: "INV-006", invoiceNumber: "001-001-000000006", customerId: "CUS-003", issueDate: "2023-10-31", total: 552.00, status: "Error", itemIds: [{ productId: "PROD-001", quantity: 3, discount: 0 }] },
];

export const getFullInvoices = (): Invoice[] => {
  return invoices.map(inv => {
    const customer = customers.find(c => c.id === inv.customerId);
    if (!customer) throw new Error("Customer not found");

    const items = inv.itemIds.map(itemId => {
      const product = products.find(p => p.id === itemId.productId);
      if (!product) throw new Error("Product not found");
      return {
        product,
        quantity: itemId.quantity,
        discount: itemId.discount
      }
    });

    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      issueDate: inv.issueDate,
      total: inv.total,
      status: inv.status,
      customer,
      items
    };
  });
};
