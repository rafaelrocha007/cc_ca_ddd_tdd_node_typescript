import Enrollment from "./Enrollment";

export default interface EnrollmentRepository {
  enrollments: Enrollment[];
  save(enrollment: Enrollment): void;
  findAllByClass(level: string, module: string, clazz: string): Enrollment[];
  findByCpf(cpf: string): Enrollment | undefined | null;
  count(): number;
}
