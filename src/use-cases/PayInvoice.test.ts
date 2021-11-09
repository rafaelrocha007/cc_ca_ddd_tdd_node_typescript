import EnrollStudent from "./EnrollStudent";
import GetEnrollment from "./GetEnrollment";
import PayInvoice from "./PayInvoice";
import RepositoryMemoryFactory from "../RepositoryMemoryFactory";
import Invoice from "../Invoice";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;
let mockedDate: Date;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    const repositoryFactory = new RepositoryMemoryFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
    payInvoice = new PayInvoice(repositoryFactory);
    mockedDate = new Date(2021, 1, 10);
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
        amount: 100000,
        requestDate: mockedDate,
      });
    }).toThrow(new Error("Only full installment amount is accepted"));
  });

  test("Should pay overdue invoice", () => {
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
    const invoiceAmount = 141666;
    const penaltyAmount = 14166;
    const interestAmount = 7083;
    payInvoice.execute({
      code: "2021EM3A0001",
      month: 1,
      year: 2021,
      amount: invoiceAmount + penaltyAmount + interestAmount,
      requestDate: mockedDate,
    });
    const enrollment = payInvoice.enrollmentRepository.get("2021EM3A0001");
    const paidInvoice = enrollment.invoices[0];
    expect(paidInvoice.events).toHaveLength(3);
    expect(paidInvoice.getBalance(mockedDate)).toBe(0);
  });

  test("Should calculate due date and return status open or overdue for each invoice", () => {
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
    const { invoices } = getEnrollment.execute("2021EM3A0001", mockedDate);
    expect(invoices[0].status).toBe(Invoice.STATUS_OVERDUE);
  });
});
