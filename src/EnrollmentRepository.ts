export default interface EnrollmentRepository {
  enrollments: any;
  save(enrollment: any): void;
  findAllByClass(level: string, module: string, clazz: string): any;
  findByCpf(cpf: string): any;
  count(): number;
}
