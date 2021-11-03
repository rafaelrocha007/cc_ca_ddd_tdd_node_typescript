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
import Enrollment from "../Enrollment";
import CancelEnrollment from "./CancelEnrollment";

let enrollmentRepository: EnrollmentRepository;
let invoiceRepository: InvoiceRepository;
let levelRepository: LevelRepository;
let classRepository: ClassRepository;
let moduleRepository: ModuleRepository;
let enrollStudent: EnrollStudent;
let cancelEnrollment: CancelEnrollment;

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
    cancelEnrollment = new CancelEnrollment(enrollmentRepository);
  });

  test("Should cancel enrollment", () => {
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
    cancelEnrollment.execute({
      code: "2021EM3A0001",
    });
    const enrollment = enrollmentRepository.findByCode("2021EM3A0001");
    expect(enrollment.status).toBe(Enrollment.STATUS_CANCELLED);
  });
});
