import Enrollment from "../Enrollment";
import EnrollmentRepository from "../EnrollmentRepository";
import Invoice from "../Invoice";
import InvoiceRepository from "../InvoiceRepository";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;
  invoiceRepository: InvoiceRepository;

  constructor(
    enrollmentRepository: EnrollmentRepository,
    invoiceRepository: InvoiceRepository
  ) {
    this.enrollmentRepository = enrollmentRepository;
    this.invoiceRepository = invoiceRepository;
  }

  execute({ code }: { code: string }): Enrollment {
    const enrollment = this.enrollmentRepository.findByCode(code);
    const invoices = this.invoiceRepository.findAllByEnrollmentCode(code);
    const paidInvoicesAmount = invoices.reduce((total, invoice) => {
      if (invoice.status === Invoice.STATUS_PAID) total += invoice.amount;
      return total;
    }, 0);
    enrollment.balance = paidInvoicesAmount - enrollment.module.price;
    return enrollment;
  }
}
