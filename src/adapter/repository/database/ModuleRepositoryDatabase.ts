import Module from "../../../domain/entity/Module";
import ModuleRepository from "../../../domain/repository/ModuleRepository";
import MySqlConnectionPool from "../../../infra/database/MySqlConnectionPool";

export default class ModuleRepositoryDatabase implements ModuleRepository {
  constructor() {}

  async findByCode(level: string, code: string): Promise<Module> {
    const moduleData = await MySqlConnectionPool.one(
      "select * from module where level = ? and code = ?",
      [level, code]
    );
    return new Module({
      level: moduleData.level,
      code: moduleData.code,
      description: moduleData.description,
      minimumAge: moduleData.minimum_age,
      price: moduleData.price,
    });
  }
}
