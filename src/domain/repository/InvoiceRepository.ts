import Invoice from "../entity/Invoice";

export default interface InvoiceRepository {
  invoices: Invoice[];
  save(invoice: Invoice): void;
  findAllByEnrollmentCode(code: string): Invoice[];
}
