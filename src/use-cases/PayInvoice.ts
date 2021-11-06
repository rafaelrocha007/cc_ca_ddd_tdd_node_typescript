import EnrollmentRepository from "../EnrollmentRepository";
import Invoice from "../Invoice";
import InvoiceRepository from "../InvoiceRepository";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class PayInvoice {
  enrollmentRepository: EnrollmentRepository;
  invoiceRepository: InvoiceRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    this.invoiceRepository = repositoryFactory.createInvoiceRepository();
  }

  execute({
    code,
    month,
    year,
    amount,
  }: {
    code: string;
    month: number;
    year: number;
    amount: number;
  }) {
    const enrollment = this.enrollmentRepository.get(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    let foundIndex = enrollment.invoices.findIndex(
      (invoice) =>
        invoice.code === code &&
        invoice.month === month &&
        invoice.year === year
    );
    const originalInvoice = enrollment.invoices[foundIndex];
    if (originalInvoice.amount != amount) {
      throw new Error("Only full installment amount is accepted");
    }
    enrollment.invoices[foundIndex] = {
      ...originalInvoice,
      status: Invoice.STATUS_PAID,
    };
  }
}
