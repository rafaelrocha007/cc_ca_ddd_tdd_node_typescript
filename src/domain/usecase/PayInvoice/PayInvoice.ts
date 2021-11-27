import RepositoryAbstractFactory from "../../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../../repository/EnrollmentRepository";
import PayInvoiceInputData from "./PayInvoiceInputData";

export default class PayInvoice {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  async execute({
    code,
    month,
    year,
    amount,
    paymentDate,
  }: PayInvoiceInputData) {
    const enrollment = await this.enrollmentRepository.get(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    Promise.resolve(enrollment.payInvoice(month, year, amount, paymentDate));
  }
}
