/**
 * SAMPLE DATA. Three fictional invoices/receipts used by the extraction demo.
 * Vendors, numbers and tax registration IDs are invented.
 */

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface SampleInvoice {
  id: string;
  label: string;
  kind: "invoice" | "receipt";
  style: "clean" | "modern" | "thermal";
  vendor: string;
  vendorAddress: string;
  billTo?: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  gstNumber?: string;
  items: LineItem[];
  /** Amounts as printed on the document (may contain errors). */
  printed: { subtotal: number; gst: number; pst: number; total: number };
  /** Simulated OCR confidence per field (0–1). */
  confidence: Record<string, number>;
  /** Invoice numbers already processed in the accounting system (for duplicate check). */
  previouslyProcessed?: boolean;
}

export const SAMPLE_INVOICES: SampleInvoice[] = [
  {
    id: "coastal",
    label: "Office supplies invoice",
    kind: "invoice",
    style: "clean",
    vendor: "Coastal Office Supply Ltd.",
    vendorAddress: "1180 Hastings St, Vancouver, BC",
    billTo: "Erun Demo Co., 400 Burrard St, Vancouver, BC",
    invoiceNumber: "INV-20418",
    date: "2026-10-14",
    dueDate: "2026-11-13",
    gstNumber: "81234 5678 RT0001",
    items: [
      { description: "Copy paper, 8.5x11 (case)", qty: 6, unitPrice: 54.99, amount: 329.94 },
      { description: "Toner cartridge, black", qty: 2, unitPrice: 118.5, amount: 237.0 },
      { description: "Ergonomic desk chair", qty: 1, unitPrice: 389.0, amount: 389.0 },
    ],
    printed: { subtotal: 955.94, gst: 47.8, pst: 66.92, total: 1070.66 },
    confidence: { vendor: 0.99, invoiceNumber: 0.98, date: 0.97, dueDate: 0.96, gstNumber: 0.94, items: 0.95, totals: 0.98 },
  },
  {
    id: "northshore",
    label: "IT services invoice (has an error)",
    kind: "invoice",
    style: "modern",
    vendor: "Northshore IT Services Inc.",
    vendorAddress: "210 Esplanade W, North Vancouver, BC",
    billTo: "Erun Demo Co.",
    invoiceNumber: "NS-7731",
    date: "2026-10-31",
    dueDate: "2026-11-15",
    gstNumber: "79876 1234 RT0001",
    items: [
      { description: "Managed IT support, October", qty: 1, unitPrice: 1450.0, amount: 1450.0 },
      { description: "Laptop setup & imaging", qty: 3, unitPrice: 95.0, amount: 285.0 },
      { description: "Microsoft 365 Business licences", qty: 12, unitPrice: 28.5, amount: 342.0 },
    ],
    // Subtotal printed incorrectly (should be 2,077.00).
    printed: { subtotal: 2177.0, gst: 108.85, pst: 0, total: 2285.85 },
    confidence: { vendor: 0.98, invoiceNumber: 0.97, date: 0.95, dueDate: 0.93, gstNumber: 0.91, items: 0.92, totals: 0.97 },
  },
  {
    id: "harbour",
    label: "Restaurant receipt (photo)",
    kind: "receipt",
    style: "thermal",
    vendor: "Harbour Catering Co.",
    vendorAddress: "88 Water St, Vancouver",
    invoiceNumber: "R-55102",
    date: "2026-11-03",
    items: [
      { description: "Team lunch platter", qty: 2, unitPrice: 85.0, amount: 170.0 },
      { description: "Sparkling water", qty: 8, unitPrice: 3.5, amount: 28.0 },
      { description: "Delivery fee", qty: 1, unitPrice: 15.0, amount: 15.0 },
    ],
    printed: { subtotal: 213.0, gst: 10.65, pst: 0, total: 223.65 },
    confidence: { vendor: 0.9, invoiceNumber: 0.82, date: 0.88, items: 0.84, totals: 0.93 },
    previouslyProcessed: true,
  },
];
