import Classroom from "../../../domain/entity/Classroom";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";
import MySqlConnectionPool from "../../../infra/database/MySqlConnectionPool";

export default class ClassroomRepositoryDatabase
  implements ClassroomRepository
{
  async findByCode(
    level: string,
    module: string,
    code: string
  ): Promise<Classroom> {
    const classroomData = await MySqlConnectionPool.one(
      "select * from classroom where level = ? and module = ? and code = ?",
      [level, module, code]
    );
    return new Classroom({
      level: classroomData.level,
      module: classroomData.module,
      code: classroomData.code,
      capacity: classroomData.capacity,
      startDate: classroomData.start_date,
      endDate: classroomData.end_date,
    });
  }
}
