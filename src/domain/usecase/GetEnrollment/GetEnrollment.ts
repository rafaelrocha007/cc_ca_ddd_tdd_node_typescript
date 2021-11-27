import RepositoryAbstractFactory from "../../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../../repository/EnrollmentRepository";
import EnrollStudentOutputData from "../EnrollStudent/EnrollStudentOutputData";
import GetEnrollmentOutputData from "./GetEnrollmentOutputData";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  async execute(
    code: string,
    currentDate: Date
  ): Promise<GetEnrollmentOutputData> {
    const enrollment = await this.enrollmentRepository.get(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
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
    return Promise.resolve(getEnrollmentOutputData);
  }
}
