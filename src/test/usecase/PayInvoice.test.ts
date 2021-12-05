import EnrollStudent from "../../domain/usecase/EnrollStudent/EnrollStudent";
import GetEnrollment from "../../domain/usecase/GetEnrollment/GetEnrollment";
import PayInvoice from "../../domain/usecase/PayInvoice/PayInvoice";
import RepositoryDatabaseFactory from "../../adapter/factory/RepositoryDatabaseFactory";
import MySqlConnectionPool from "../../infra/database/MySqlConnectionPool";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let payInvoice: PayInvoice;
let mockedDate: Date;

describe("Enroll Student use case", () => {
  beforeEach(async () => {
    const repositoryFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
    payInvoice = new PayInvoice(repositoryFactory);
    mockedDate = new Date("2021-01-10");
    await repositoryFactory.createEnrollmentRepository().clean();
  });

  afterAll(async () => {
    MySqlConnectionPool.getInstance().end();
  });

  test("Should not pay an enrollment invoice without full installment amount", async () => {
    try {
      const cpf = "755.525.774-26";
      const installments = 12;
      await enrollStudent.execute({
        studentName: "Maria Carolina Fonseca",
        studentCpf: cpf,
        studentBirthDate: "2002-03-12",
        level: "EM",
        module: "3",
        classroom: "A",
        installments,
      });
      await payInvoice.execute({
        code: "2021EM3A0001",
        month: 1,
        year: 2021,
        amount: 100000,
        paymentDate: mockedDate,
      });
    } catch (e) {
      expect(e).toEqual(new Error("Only full installment amount is accepted"));
    }
  });

  test("Should pay overdue invoice", async () => {
    const cpf = "755.525.774-26";
    const installments = 10;
    await enrollStudent.execute({
      studentName: "Maria Carolina Fonseca",
      studentCpf: cpf,
      studentBirthDate: "2002-03-12",
      level: "EM",
      module: "3",
      classroom: "A",
      installments,
    });
    const invoiceAmount = 170000;
    const penaltyAmount = 17000;
    const interestAmount = 8500;
    await payInvoice.execute({
      code: "2021EM3A0001",
      month: 1,
      year: 2021,
      amount: invoiceAmount + penaltyAmount + interestAmount,
      paymentDate: mockedDate,
    });
    const getEnrollmentOutputData = await getEnrollment.execute(
      "2021EM3A0001",
      mockedDate
    );
    const paidInvoice = getEnrollmentOutputData.invoices[0];
    expect(paidInvoice.balance).toBe(0);
  });
});
