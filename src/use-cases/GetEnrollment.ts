import Enrollment from "../Enrollment";
import EnrollmentRepository from "../EnrollmentRepository";
import Invoice from "../Invoice";
import InvoiceRepository from "../InvoiceRepository";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;
  invoiceRepository: InvoiceRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    this.invoiceRepository = repositoryFactory.createInvoiceRepository();
  }

  execute(code: string): any {
    const enrollment = this.enrollmentRepository.get(code);
    const invoices = this.invoiceRepository.findAllByEnrollmentCode(code);
    const paidInvoicesAmount = invoices.reduce((total, invoice) => {
      if (invoice.status === Invoice.STATUS_PAID) total += invoice.amount;
      return total;
    }, 0);
    enrollment.balance = paidInvoicesAmount - enrollment.module.price;
    return {
      code: enrollment.getCode(),
      balance: enrollment.getBalance(),
      status: enrollment.status
    };
  }
}
