import Enrollment from "../Enrollment";
import EnrollmentRepository from "../EnrollmentRepository";
import RepositoryAbstractFactory from "../RepositoryAbstractFactory";

export default class CancelEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute({ code }: { code: string }): void {
    this.enrollmentRepository.updateStatus(code, Enrollment.STATUS_CANCELLED);
  }
}
