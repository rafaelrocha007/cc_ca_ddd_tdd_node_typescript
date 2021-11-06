import ClassroomRepository from "./ClassroomRepository";
import ClassroomRepositoryMemory from "./ClassroomRepositoryMemory";
import EnrollmentRepository from "./EnrollmentRepository";
import EnrollmentRepositoryMemory from "./EnrollmentRepositoryMemory";
import InvoiceRepository from "./InvoiceRepository";
import InvoiceRepositoryMemory from "./InvoiceRepositoryMemory";
import LevelRepository from "./LevelRepository";
import LevelRepositoryMemory from "./LevelRepositoryMemory";
import ModuleRepository from "./ModuleRepository";
import ModuleRepositoryMemory from "./ModuleRepositoryMemory";
import RepositoryAbstractFactory from "./RepositoryAbstractFactory";

export default class RepositoryMemoryFactory
  implements RepositoryAbstractFactory
{
  enrollmentRepository: EnrollmentRepository = new EnrollmentRepositoryMemory();
  invoiceRepository: InvoiceRepository = new InvoiceRepositoryMemory();

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
    if (!this.enrollmentRepository) {
      this.enrollmentRepository = new EnrollmentRepositoryMemory();
    }
    return this.enrollmentRepository;
  }

  createInvoiceRepository(): InvoiceRepository {
    if (!this.invoiceRepository) {
      this.invoiceRepository = new InvoiceRepositoryMemory();
    }
    return this.invoiceRepository;
  }
}
