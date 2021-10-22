import EnrollmentRepository from "./EnrollmentRepository";

export default class EnrollmentRepositoryMemory
  implements EnrollmentRepository
{
  enrollments: any;
  constructor() {
    this.enrollments = [];
  }
  save(enrollment: any): void {
    this.enrollments.push(enrollment);
  }
  findAllByClass(level: string, module: string, clazz: string): any {
    return this.enrollments.filter(
      (enrollment: any) =>
        enrollment.class === clazz &&
        enrollment.module === module &&
        enrollment.level === level
    );
  }
  findByCpf(cpf: string): any {
    return this.enrollments.find(
      (enrollment:any) => enrollment.student.cpf === cpf
    );
  }
  count(): number {
    return this.enrollments.length
  }
}
