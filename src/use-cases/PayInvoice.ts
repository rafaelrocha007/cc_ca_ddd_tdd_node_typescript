import EnrollmentRepository from "../EnrollmentRepository";
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
    requestDate,
  }: {
    code: string;
    month: number;
    year: number;
    amount: number;
    requestDate: Date;
  }) {
    const enrollment = this.enrollmentRepository.get(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    enrollment.payInvoice(month, year, amount, requestDate);
  }
}
