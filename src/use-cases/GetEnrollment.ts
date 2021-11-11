import EnrollmentRepository from "../EnrollmentRepository";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute(code: string, currentDate: Date): any {
    const enrollment = this.enrollmentRepository.get(code);
    return {
      code: enrollment.getCode(),
      balance: enrollment.getInvoiceBalance(currentDate),
      invoices: enrollment.invoices.map((invoice) => ({
        amount: invoice.amount,
        penaltyAmount: invoice.getPenalty(currentDate),
        interest: invoice.getInterest(currentDate),
        status: invoice.getStatus(currentDate),
        dueDate: invoice.getDueDate().toISOString().split('T')[0],
      })),
      status: enrollment.status,
    };
  }
}
