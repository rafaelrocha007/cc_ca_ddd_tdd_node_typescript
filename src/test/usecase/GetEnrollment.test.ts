import Invoice from "../../domain/entity/Invoice";
import EnrollStudent from "../../domain/usecase/EnrollStudent/EnrollStudent";
import GetEnrollment from "../../domain/usecase/GetEnrollment/GetEnrollment";
import RepositoryDatabaseFactory from "../../adapter/factory/RepositoryDatabaseFactory";
import MySqlConnectionPool from "../../infra/database/MySqlConnectionPool";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let mockedDate: Date;

describe("Enroll Student use case", () => {
  beforeEach(async () => {
    const repositoryFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
    mockedDate = new Date("2021-01-10");
    await repositoryFactory.createEnrollmentRepository().clean();
  });

  afterAll(async () => {
    MySqlConnectionPool.getInstance().end();
  });

  test("Should get enrollment by code with invoice balance", async () => {
    expect.assertions(2);
    try {
      const cpf = "755.525.774-26";
      const installments = 12;
      await enrollStudent.execute({
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
      mockedDate = new Date("2021-01-01");
      const getEnrollmentOutputData = await getEnrollment.execute(
        "2021EM3A0001",
        mockedDate
      );
      expect(getEnrollmentOutputData.code).toBe("2021EM3A0001");
      const moduleAmount = 1700000;
      expect(getEnrollmentOutputData.balance).toBe(moduleAmount);
    } catch (e) {
      console.log(e);
    }
  });

  test("Should calculate due date and return status open or overdue for each invoice", async () => {
    try {
      const cpf = "755.525.774-26";
      const installments = 12;
      await enrollStudent.execute({
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
      const { invoices } = await getEnrollment.execute(
        "2021EM3A0001",
        mockedDate
      );
      expect(invoices[0].status).toBe(Invoice.STATUS_OVERDUE);
      expect(invoices[0].dueDate).toBe("2021-01-05");
    } catch (e) {
      console.log(e);
    }
  });

  test("Should calculate penalty and interests", async () => {
    try {
      const cpf = "755.525.774-26";
      const installments = 10;
      await enrollStudent.execute({
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
      mockedDate = new Date("2021-01-10");
      const getEnrollmentOutputData = await getEnrollment.execute(
        "2021EM3A0001",
        mockedDate
      );
      expect(getEnrollmentOutputData.code).toBe("2021EM3A0001");
      const moduleAmount = 1700000;
      const penaltyAmount = 17000;
      const interestsAmount = 8500;
      expect(getEnrollmentOutputData.balance).toBe(moduleAmount);
      const invoice = getEnrollmentOutputData.invoices[0];
      expect(invoice.penalty).toBe(penaltyAmount);
      expect(invoice.interests).toBe(interestsAmount);
    } catch (e) {
      console.log(e);
    }
  });
});
