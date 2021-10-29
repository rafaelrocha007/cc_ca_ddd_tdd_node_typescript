import Classroom from "./Classroom";

export default interface ClassRepository {
  findByCode(level: string, module: string, code: string): Classroom;
}
