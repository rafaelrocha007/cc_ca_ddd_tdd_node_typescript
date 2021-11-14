import ClassroomRepository from "../repository/ClassroomRepository";
import EnrollmentRepository from "../repository/EnrollmentRepository";
import InvoiceRepository from "../repository/InvoiceRepository";
import LevelRepository from "../repository/LevelRepository";
import ModuleRepository from "../repository/ModuleRepository";

export default interface RepositoryAbstractFactory {
  createClassroomRepository(): ClassroomRepository;

  createEnrollmentRepository(): EnrollmentRepository;

  createInvoiceRepository(): InvoiceRepository;

  createLevelRepository(): LevelRepository;

  createModuleRepository(): ModuleRepository;
}
