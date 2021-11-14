import RepositoryAbstractFactory from "../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import InvoiceRepository from "../repository/InvoiceRepository";
import PayInvoiceInputData from "./PayInvoiceInputData";

export default class PayInvoice {
  enrollmentRepository: EnrollmentRepository;
  invoiceRepository: InvoiceRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
    this.invoiceRepository = repositoryFactory.createInvoiceRepository();
  }

  execute({ code, month, year, amount, paymentDate }: PayInvoiceInputData) {
    const enrollment = this.enrollmentRepository.get(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    enrollment.payInvoice(month, year, amount, paymentDate);
  }
}
