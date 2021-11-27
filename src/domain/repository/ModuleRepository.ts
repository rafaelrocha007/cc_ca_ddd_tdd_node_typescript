import Module from "../entity/Module";

export default interface ModuleRepository {
  findByCode(levelCode: string, code: string): Promise<Module>;
}
