export default interface ClassRepository {
  findByCode(level: string, module: string, code: string): any;
}
