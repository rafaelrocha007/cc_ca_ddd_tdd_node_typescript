import Enrollment from "./Enrollment";

export default interface EnrollmentRepository {
  enrollments: Enrollment[];
  save(enrollment: Enrollment): void;
  findAllByClass(level: string, module: string, clazz: string): Enrollment[];
  findByCode(code: string): Enrollment | undefined | null;
  findByCpf(cpf: string): Enrollment | undefined | null;
  count(): number;
}
