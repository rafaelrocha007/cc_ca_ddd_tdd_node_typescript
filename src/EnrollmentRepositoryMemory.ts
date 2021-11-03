import Enrollment from "./Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";

export default class EnrollmentRepositoryMemory
  implements EnrollmentRepository
{
  enrollments: Enrollment[];

  constructor() {
    this.enrollments = [];
  }

  save(enrollment: Enrollment): void {
    this.enrollments.push(enrollment);
  }

  updateStatus(code: string, status: string): void {
    let foundIndex = this.enrollments.findIndex(
      (enrollment) => enrollment.getCode() === code
    );
    this.enrollments[foundIndex].status = Enrollment.STATUS_CANCELLED;
  }

  findAllByClass(level: string, module: string, clazz: string): Enrollment[] {
    return this.enrollments.filter(
      (enrollment: Enrollment) =>
        enrollment.classroom.code === clazz &&
        enrollment.module.code === module &&
        enrollment.level.code === level
    );
  }

  findByCode(code: string): Enrollment {
    const enrollment = this.enrollments.find(
      (enrollment: Enrollment) => enrollment.getCode() === code
    );
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return enrollment;
  }

  findByCpf(cpf: string): Enrollment | null {
    const enrollment = this.enrollments.find(
      (enrollment: Enrollment) => enrollment.student.cpf.value === cpf
    );
    if (enrollment) return enrollment;
    return null;
  }

  count(): number {
    return this.enrollments.length;
  }
}
