import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import ClassroomRepository from "../../domain/repository/ClassroomRepository";
import EnrollmentRepository from "../../domain/repository/EnrollmentRepository";
import LevelRepository from "../../domain/repository/LevelRepository";
import ModuleRepository from "../../domain/repository/ModuleRepository";
import ClassroomRepositoryDatabase from "../repository/database/ClassroomRepositoryDatabase";
import EnrollmentRepositoryDatabase from "../repository/database/EnrollmentRepositoryDatabase";
import LevelRepositoryDatabase from "../repository/database/LevelRepositoryDatabase";
import ModuleRepositoryDatabase from "../repository/database/ModuleRepositoryDatabase";

export default class RepositoryDatabaseFactory
  implements RepositoryAbstractFactory
{
  createLevelRepository(): LevelRepository {
    return new LevelRepositoryDatabase();
  }

  createModuleRepository(): ModuleRepository {
    return new ModuleRepositoryDatabase();
  }

  createClassroomRepository(): ClassroomRepository {
    return new ClassroomRepositoryDatabase();
  }

  createEnrollmentRepository(): EnrollmentRepository {
    return new EnrollmentRepositoryDatabase(
      new LevelRepositoryDatabase(),
      new ModuleRepositoryDatabase(),
      new ClassroomRepositoryDatabase()
    );
  }
}
