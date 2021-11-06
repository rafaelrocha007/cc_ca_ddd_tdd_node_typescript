import EnrollmentRepository from "../EnrollmentRepository";
import EnrollStudent from "./EnrollStudent";
import GetEnrollment from "./GetEnrollment";
import InvoiceRepository from "../InvoiceRepository";
import RepositoryMemoryFactory from "../RepositoryMemoryFactory";

let enrollmentRepository: EnrollmentRepository;
let invoiceRepository: InvoiceRepository;
let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    const repositoryFactory = new RepositoryMemoryFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
  });

  test.only("Should get enrollment by code with invoice balance", () => {
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
    const getEnrollmentOutputData = getEnrollment.execute("2021EM3A0001");
    expect(getEnrollmentOutputData.code).toBe("2021EM3A0001");
    const module = enrollStudent.moduleRepository.findByCode("EM", "3");
    const totalPaidInvoices = 0;
    expect(getEnrollmentOutputData.balance).toBe(
      totalPaidInvoices - module.price
    );
  });
});
