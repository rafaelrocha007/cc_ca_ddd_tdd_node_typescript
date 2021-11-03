import Enrollment from "../Enrollment";
import EnrollmentRepository from "../EnrollmentRepository";

export default class CancelEnrollment {
  enrollmentRepository: EnrollmentRepository;

  constructor(enrollmentRepository: EnrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }

  execute({ code }: { code: string }): void {
    this.enrollmentRepository.updateStatus(code, Enrollment.STATUS_CANCELLED);
  }
}
