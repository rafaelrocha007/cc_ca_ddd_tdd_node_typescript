import Enrollment from "../../domain/entity/Enrollment";
import EnrollStudent from "../../domain/usecase/EnrollStudent/EnrollStudent";
import CancelEnrollment from "../../domain/usecase/CancelEnrollment/CancelEnrollment";
import RepositoryDatabaseFactory from "../../adapter/factory/RepositoryDatabaseFactory";
import MySqlConnectionPool from "../../infra/database/MySqlConnectionPool";

let enrollStudent: EnrollStudent;
let cancelEnrollment: CancelEnrollment;

describe("Enroll Student use case", () => {
  beforeEach(async () => {
    const repositoryFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    cancelEnrollment = new CancelEnrollment(repositoryFactory);
    await repositoryFactory.createEnrollmentRepository().clean();
  });

  afterAll(async () => {
    MySqlConnectionPool.getInstance().end();
  });

  test("Should cancel enrollment", async () => {
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
    await cancelEnrollment.execute("2021EM3A0001");
    const enrollment = await enrollStudent.enrollmentRepository.get("2021EM3A0001");
    expect(enrollment?.status).toBe(Enrollment.STATUS_CANCELLED);
  });
});
