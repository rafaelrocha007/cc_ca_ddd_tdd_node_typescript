import Enrollment from "./Enrollment";

export default interface EnrollmentRepository {
  enrollments: Enrollment[];
  save(enrollment: Enrollment): void;
  updateStatus(code: string, status: string): void;
  findAllByClass(level: string, module: string, clazz: string): Enrollment[];
  get(code: string): Enrollment;
  findByCpf(cpf: string): Enrollment | null;
  count(): number;
}
