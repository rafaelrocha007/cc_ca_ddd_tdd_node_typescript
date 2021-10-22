export default interface ModuleRepository {
  findByCode(levelCode: string, code: string): any;
}
