import Enrollment from "../Enrollment";
import EnrollmentRepository from "../EnrollmentRepository";

export default class GetEnrollment {
  enrollmentRepository: EnrollmentRepository;
  constructor(enrollmentRepository: EnrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }

  execute({ code }: { code: string }): Enrollment {
    const enrollment = this.enrollmentRepository.findByCode(code);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return enrollment;
  }
}
