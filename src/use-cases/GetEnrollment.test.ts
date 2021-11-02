import EnrollmentRepository from "../EnrollmentRepository";
import EnrollmentRepositoryMemory from "../EnrollmentRepositoryMemory";
import LevelRepository from "../LevelRepository";
import LevelRepositoryMemory from "../LevelRepositoryMemory";
import ModuleRepository from "../ModuleRepository";
import ModuleRepositoryMemory from "../ModuleRepositoryMemory";
import ClassRepository from "../ClassroomRepository";
import ClassRepositoryMemory from "../ClassroomRepositoryMemory";
import EnrollStudent from "./EnrollStudent";
import GetEnrollment from "./GetEnrollment";
import InvoiceRepositoryMemory from "../InvoiceRepositoryMemory";
import InvoiceRepository from "../InvoiceRepository";

let enrollmentRepository: EnrollmentRepository;
let invoiceRepository: InvoiceRepository;
let levelRepository: LevelRepository;
let classRepository: ClassRepository;
let moduleRepository: ModuleRepository;
let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    enrollmentRepository = new EnrollmentRepositoryMemory();
    invoiceRepository = new InvoiceRepositoryMemory();
    levelRepository = new LevelRepositoryMemory();
    classRepository = new ClassRepositoryMemory();
    moduleRepository = new ModuleRepositoryMemory();
    enrollStudent = new EnrollStudent(
      levelRepository,
      moduleRepository,
      classRepository,
      enrollmentRepository
    );
    getEnrollment = new GetEnrollment(enrollmentRepository, invoiceRepository);
  });

  test("Should get enrollment by code with invoice balance", () => {
    const cpf = "755.525.774-26";
    const installments = 12;
    enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf,
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
      installments,
    });
    const enrollment = getEnrollment.execute({
      code: "2021EM3A0001",
    });
    const module = moduleRepository.findByCode("EM", "3");
    const totalPaidInvoices = 0;
    expect(enrollment.getBalance()).toBe(totalPaidInvoices - module.price);
  });

  test("Should pay enrollment invoice", () => {
    const cpf = "755.525.774-26";
    const installments = 12;
    enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf,
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
      installments,
    });
    const enrollment = getEnrollment.execute({
      code: "2021EM3A0001",
    });
    const module = moduleRepository.findByCode("EM", "3");
    const totalPaidInvoices = 0;
    expect(enrollment.getBalance()).toBe(totalPaidInvoices - module.price);
  });
});
