import ClassroomRepository from "./ClassroomRepository";
import EnrollmentRepository from "./EnrollmentRepository";
import InvoiceRepository from "./InvoiceRepository";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";

export default interface RepositoryAbstractFactory {
  createLevelRepository(): LevelRepository;

  createModuleRepository(): ModuleRepository;

  createClassroomRepository(): ClassroomRepository;

  createEnrollmentRepository(): EnrollmentRepository;

  createInvoiceRepository(): InvoiceRepository;
}
