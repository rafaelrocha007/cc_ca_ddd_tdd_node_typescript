import Level from "../../../domain/entity/Level";
import LevelRepository from "../../../domain/repository/LevelRepository";
import MySqlConnectionPool from "../../../infra/database/MySqlConnectionPool";

export default class LevelRepositoryDatabase implements LevelRepository {
  constructor() {}

  async findByCode(code: string): Promise<Level> {
    const levelData = await MySqlConnectionPool.one(
      "select * from level where code = ?",
      [code]
    );
    return new Level({
      code: levelData.code,
      description: levelData.description,
    });
  }
}
