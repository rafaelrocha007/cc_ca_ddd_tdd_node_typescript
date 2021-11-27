import Enrollment from "../../../domain/entity/Enrollment";
import EnrollmentRepository from "../../../domain/repository/EnrollmentRepository";

export default class EnrollmentRepositoryMemory
  implements EnrollmentRepository
{
  enrollments: Enrollment[];

  constructor() {
    this.enrollments = [];
  }

  async save(enrollment: Enrollment): Promise<void> {
    this.enrollments.push(enrollment);
  }

  async updateStatus(code: string, status: string): Promise<void> {
    let foundIndex = this.enrollments.findIndex(
      (enrollment) => enrollment.getCode() === code
    );
    this.enrollments[foundIndex].status = Enrollment.STATUS_CANCELLED;
  }

  async findAllByClassroom(
    level: string,
    module: string,
    clazz: string
  ): Promise<Enrollment[]> {
    return Promise.resolve(
      this.enrollments.filter(
        (enrollment: Enrollment) =>
          enrollment.classroom.code === clazz &&
          enrollment.module.code === module &&
          enrollment.level.code === level
      )
    );
  }

  async get(code: string): Promise<Enrollment> {
    const enrollment = this.enrollments.find(
      (enrollment: Enrollment) => enrollment.getCode() === code
    );
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return Promise.resolve(enrollment);
  }

  async findByCpf(cpf: string): Promise<Enrollment> {
    const enrollment = this.enrollments.find(
      (enrollment: Enrollment) => enrollment.student.cpf.value === cpf
    );
    if (enrollment) return Promise.resolve(enrollment);
    return Promise.reject(null);
  }

  async count(): Promise<number> {
    return Promise.resolve(this.enrollments.length);
  }

  async clean(): Promise<void> {

  }
}
