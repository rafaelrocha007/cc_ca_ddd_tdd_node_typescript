import EnrollmentRepository from "../EnrollmentRepository";
import GetEnrollmentOutputData from "../GetEnrollmentOutputData";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute(code: string, currentDate: Date): GetEnrollmentOutputData {
    const enrollment = this.enrollmentRepository.get(code);
    const getEnrollmentOutputData = new GetEnrollmentOutputData({
      code: enrollment.getCode(),
      balance: enrollment.getInvoiceBalance(currentDate),
      invoices: enrollment.invoices.map((invoice) => ({
        amount: invoice.amount,
        penaltyAmount: invoice.getPenalty(currentDate),
        interest: invoice.getInterest(currentDate),
        status: invoice.getStatus(currentDate),
        dueDate: invoice.getDueDate().toISOString().split("T")[0],
      })),
      status: enrollment.status,
    });
    return getEnrollmentOutputData;
  }
}
