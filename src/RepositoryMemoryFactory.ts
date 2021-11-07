import ClassroomRepository from "./ClassroomRepository";
import ClassroomRepositoryMemory from "./ClassroomRepositoryMemory";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollmentRepositoryMemorySingleton from "./EnrollmentRepositoryMemorySingleton";
import InvoiceRepository from "./InvoiceRepository";
import InvoiceRepositoryMemorySingleton from "./InvoiceRepositoryMemorySingleton";
import LevelRepository from "./LevelRepository";
import LevelRepositoryMemory from "./LevelRepositoryMemory";
import ModuleRepository from "./ModuleRepository";
import ModuleRepositoryMemory from "./ModuleRepositoryMemory";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

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
