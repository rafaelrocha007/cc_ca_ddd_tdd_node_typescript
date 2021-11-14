import EnrollStudent from "../../domain/usecase/EnrollStudent";
import GetEnrollment from "../../domain/usecase/GetEnrollment";
import PayInvoice from "../../domain/usecase/PayInvoice";
import RepositoryMemoryFactory from "../../adapter/factory/RepositoryMemoryFactory";

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
    mockedDate = new Date("2021-01-10");
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
        paymentDate: mockedDate,
      });
    }).toThrow(new Error("Only full installment amount is accepted"));
  });

  test("Should pay overdue invoice", () => {
    const cpf = "755.525.774-26";
    const installments = 10;
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
    const invoiceAmount = 170000;
    const penaltyAmount = 17000;
    const interestAmount = 8500;
    payInvoice.execute({
      code: "2021EM3A0001",
      month: 1,
      year: 2021,
      amount: invoiceAmount + penaltyAmount + interestAmount,
      paymentDate: mockedDate,
    });
    const getEnrollmentOutputData = getEnrollment.execute(
      "2021EM3A0001",
      mockedDate
    );
    const paidInvoice = getEnrollmentOutputData.invoices[0];
    expect(paidInvoice.balance).toBe(0);
  });
});
