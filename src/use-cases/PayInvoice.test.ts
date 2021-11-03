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
import PayInvoice from "./PayInvoice";

let enrollmentRepository: EnrollmentRepository;
let invoiceRepository: InvoiceRepository;
let levelRepository: LevelRepository;
let classRepository: ClassRepository;
let moduleRepository: ModuleRepository;
let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

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
    payInvoice = new PayInvoice(enrollmentRepository, invoiceRepository);
    getEnrollment = new GetEnrollment(enrollmentRepository, invoiceRepository);
  });

  test("Should not pay an enrollment invoice without full installment amount", () => {
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
    expect(() => {
      payInvoice.execute({
        code: "2021EM3A0001",
        month: 1,
        year: 2021,
        amount: 1000,
      });
    }).toThrow(new Error("Only full installment amount is accepted"));
  });

  test("Should pay an enrollment invoice", () => {
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
    payInvoice.execute({
      code: "2021EM3A0001",
      month: 1,
      year: 2021,
      amount: 1416.66,
    });
    const enrollment = getEnrollment.execute({
      code: "2021EM3A0001",
    });
    const module = moduleRepository.findByCode("EM", "3");
    const totalPaidInvoices = 1416.66;
    expect(enrollment.getBalance()).toBe(totalPaidInvoices - module.price);
  });
});
