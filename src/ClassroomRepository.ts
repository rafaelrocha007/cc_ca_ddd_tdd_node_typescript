import Classroom from "./Classroom";

export default interface ClassroomRepository {
  findByCode(level: string, module: string, code: string): Classroom;
}
