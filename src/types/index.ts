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

export type InvoiceStatus = "Generada" | "Enviada" | "Autorizada" | "No Autorizada" | "Anulada" | "Error";

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

export type TestName = 
  | "ping"
  | "checkP12"
  | "testP12Secret"
  | "buildInvoiceXml"
  | "signXmlTest"
  | "sriPing"
  | "sriSendTest"
  | "sriAuthorizeTest"
  | "fullFlow";

export type TestStatus = "idle" | "running" | "success" | "error";

export interface TestExecution {
  id: string;
  name: TestName;
  status: TestStatus;
  result: any;
  duration: number;
  timestamp: string;
}
