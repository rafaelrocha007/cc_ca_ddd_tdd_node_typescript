import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import CancelEnrollment from "../../domain/usecase/CancelEnrollment/CancelEnrollment";
import EnrollStudent from "../../domain/usecase/EnrollStudent/EnrollStudent";
import EnrollStudentInputData from "../../domain/usecase/EnrollStudent/EnrollStudentInputData";
import EnrollStudentOutputData from "../../domain/usecase/EnrollStudent/EnrollStudentOutputData";
import GetEnrollment from "../../domain/usecase/GetEnrollment/GetEnrollment";
import GetEnrollmentOutputData from "../../domain/usecase/GetEnrollment/GetEnrollmentOutputData";
import PayInvoice from "../../domain/usecase/PayInvoice/PayInvoice";

export default class EnrollmentController {
  repositoryFactory: RepositoryAbstractFactory;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.repositoryFactory = repositoryFactory;
  }

  async enrollStudent(data: any): Promise<EnrollStudentOutputData> {
    const enrollStudent = new EnrollStudent(this.repositoryFactory);
    const enrollStudentInputData = new EnrollStudentInputData(data);
    const enrollStudentOutputData = await enrollStudent.execute(
      enrollStudentInputData
    );
    return enrollStudentOutputData;
  }

  async getEnrollment(
    code: string,
    currentDate: Date = new Date()
  ): Promise<GetEnrollmentOutputData> {
    const getEnrollment = new GetEnrollment(this.repositoryFactory);
    const getEnrollmentOutputData = getEnrollment.execute(code, currentDate);
    return getEnrollmentOutputData;
  }

  async payInvoice(
    code: string,
    month: number,
    year: number,
    amount: number,
    paymentDate: Date = new Date()
  ): Promise<void> {
    const payInvoice = new PayInvoice(this.repositoryFactory);
    payInvoice.execute({
      code,
      month,
      year,
      amount,
      paymentDate,
    });
  }

  async cancelEnrollment(code: string): Promise<void> {
    const cancelEnrollment = new CancelEnrollment(this.repositoryFactory);
    cancelEnrollment.execute(code);
  }
}
