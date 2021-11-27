import Classroom from "../entity/Classroom";

export default interface ClassroomRepository {
  findByCode(level: string, module: string, code: string): Promise<Classroom>;
}
