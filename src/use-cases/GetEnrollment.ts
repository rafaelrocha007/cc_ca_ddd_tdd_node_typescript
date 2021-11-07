import EnrollmentRepository from "../EnrollmentRepository";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute(code: string): any {
    const enrollment = this.enrollmentRepository.get(code);
    return {
      code: enrollment.getCode(),
      balance: enrollment.getInvoiceBalance(),
      invoices: enrollment.invoices.map((invoice) => ({
        amount: invoice.amount,
        // penalty: invoice.getPenalty(),
        // interest: invoice.getInterest(),
        status: invoice.getStatus(),
        dueDate: invoice.getDueDate(),
      })),
      status: enrollment.status,
    };
  }
}
