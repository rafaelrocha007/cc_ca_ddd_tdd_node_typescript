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
      balance: enrollment.getInvoiceBalance(),
      invoices: enrollment.invoices.map((invoice) => ({
        amount: invoice.amount,
        penalty: invoice.getPenalty(currentDate),
        interests: invoice.getInterests(currentDate),
        status: invoice.getStatus(currentDate),
        dueDate: invoice.dueDate.toISOString().split("T")[0],
        balance: invoice.getBalance(),
      })),
      status: enrollment.status,
    });
    return getEnrollmentOutputData;
  }
}
