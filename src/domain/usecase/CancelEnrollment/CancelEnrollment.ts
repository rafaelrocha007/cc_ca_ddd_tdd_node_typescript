import Enrollment from "../../entity/Enrollment";
import RepositoryAbstractFactory from "../../factory/RepositoryAbstractFactory";
import EnrollmentRepository from "../../repository/EnrollmentRepository";

export default class CancelEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  execute({ code }: { code: string }): void {
    this.enrollmentRepository.updateStatus(code, Enrollment.STATUS_CANCELLED);
  }
}
