import EnrollmentRepository from "../../domain/repository/EnrollmentRepository";
import RepositoryAbstractFactory from "../../domain/factory/RepositoryAbstractFactory";
import LevelRepository from "../../domain/repository/LevelRepository";
import ModuleRepository from "../../domain/repository/ModuleRepository";
import ClassroomRepository from "../../domain/repository/ClassroomRepository";
import InvoiceRepository from "../../domain/repository/InvoiceRepository";
import ClassroomRepositoryMemory from "../repository/memory/ClassroomRepositoryMemory";
import InvoiceRepositoryMemorySingleton from "../repository/memory/InvoiceRepositoryMemorySingleton";
import EnrollmentRepositoryMemorySingleton from "../repository/memory/EnrollmentRepositoryMemorySingleton";
import LevelRepositoryMemory from "../repository/memory/LevelRepositoryMemory";
import ModuleRepositoryMemory from "../repository/memory/ModuleRepositoryMemory";

export default class RepositoryMemoryFactory
  implements RepositoryAbstractFactory
{
  constructor() {
    EnrollmentRepositoryMemorySingleton.destroy();
    InvoiceRepositoryMemorySingleton.destroy();
  }

  createLevelRepository(): LevelRepository {
    return new LevelRepositoryMemory();
  }

  createModuleRepository(): ModuleRepository {
    return new ModuleRepositoryMemory();
  }

  createClassroomRepository(): ClassroomRepository {
    return new ClassroomRepositoryMemory();
  }

  createEnrollmentRepository(): EnrollmentRepository {
    return EnrollmentRepositoryMemorySingleton.getInstance();
  }

  createInvoiceRepository(): InvoiceRepository {
    return InvoiceRepositoryMemorySingleton.getInstance();
  }
}
