import Invoice from "./Invoice";
import InvoiceRepository from "./InvoiceRepository";

export default class InvoiceRepositoryMemory implements InvoiceRepository {
  invoices: Invoice[];

  constructor() {
    this.invoices = [];
  }

  save(invoice: Invoice): void {
    this.invoices.push(invoice);
  }

  findAllByEnrollmentCode(code: string): Invoice[] {
    return this.invoices.filter((invoice) => invoice.code === code);
  }
}
