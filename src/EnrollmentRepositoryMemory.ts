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

  findAllByClass(level: string, module: string, clazz: string): Enrollment[] {
    return this.enrollments.filter(
      (enrollment: Enrollment) =>
        enrollment.classroom.code === clazz &&
        enrollment.module.code === module &&
        enrollment.level.code === level
    );
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
