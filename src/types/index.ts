export type Customer = {
  id: string;
  name: string;
  identifier: string; // RUC, CI
  email: string;
  phone: string;
  address: string;
};

export type Product = {
  id:string;
  code: string;
  name: string;
  price: number;
  taxRate: number; // e.g., 0.15 for 15% IVA
};

export type InvoiceStatus = "Generated" | "Sent" | "Authorized" | "Not Authorized" | "Cancelled" | "Error";

export type InvoiceItem = {
  product: Product;
  quantity: number;
  discount: number; // percentage
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  issueDate: string;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
};
