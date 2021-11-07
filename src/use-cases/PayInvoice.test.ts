import EnrollStudent from "./EnrollStudent";
import GetEnrollment from "./GetEnrollment";
import PayInvoice from "./PayInvoice";
import RepositoryMemoryFactory from "../RepositoryMemoryFactory";
import Invoice from "../Invoice";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    const repositoryFactory = new RepositoryMemoryFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
    payInvoice = new PayInvoice(repositoryFactory);
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
    const getEnrollmentOutputData = getEnrollment.execute("2021EM3A0001");
    const totalPaidInvoices = 17000 - 1416.66;
    expect(getEnrollmentOutputData.balance).toBe(totalPaidInvoices);
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

    payInvoice.execute({
      code: "2021EM3A0001",
      month: 1,
      year: 2021,
      amount: 1416.66,
    });
    const { invoices } = getEnrollment.execute("2021EM3A0001");
    expect(invoices[0].status).toBe(Invoice.STATUS_OVERDUE);
  });
});
