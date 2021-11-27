import Enrollment from "../entity/Enrollment";

export default interface EnrollmentRepository {
  save(enrollment: Enrollment): Promise<void>;
  updateStatus(code: string, status: string): Promise<void>;
  findAllByClassroom(
    level: string,
    module: string,
    clazz: string
  ): Promise<Enrollment[]>;
  get(code: string): Promise<Enrollment | undefined>;
  findByCpf(cpf: string): Promise<Enrollment | undefined>;
  count(): Promise<number>;
  clean(): Promise<void>;
}
