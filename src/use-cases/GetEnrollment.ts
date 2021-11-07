import EnrollmentRepository from "../EnrollmentRepository";
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
    return {
      code: enrollment.getCode(),
      balance: enrollment.getInvoiceBalance(),
      status: enrollment.status
    };
  }
}
