import EnrollStudent from "./EnrollStudent";
import GetEnrollment from "./GetEnrollment";
import RepositoryMemoryFactory from "../RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let getEnrollment: GetEnrollment;
let mockedDate: Date;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    const repositoryFactory = new RepositoryMemoryFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    getEnrollment = new GetEnrollment(repositoryFactory);
    mockedDate = new Date(2021, 1, 10);
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
    mockedDate = new Date(2021, 1, 1);
    const getEnrollmentOutputData = getEnrollment.execute(
      "2021EM3A0001",
      mockedDate
    );
    expect(getEnrollmentOutputData.code).toBe("2021EM3A0001");
    const moduleAmount = 1700000;
    expect(getEnrollmentOutputData.balance).toBe(moduleAmount);
  });

  test("Should calculate penalty and interests", () => {
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
    mockedDate = new Date(2021, 1, 10);
    const getEnrollmentOutputData = getEnrollment.execute(
      "2021EM3A0001",
      mockedDate
    );
    expect(getEnrollmentOutputData.code).toBe("2021EM3A0001");
    const moduleAmount = 1700000;
    const penaltyAmount = 14166;
    const interestAmount = 7083;
    expect(getEnrollmentOutputData.balance).toBe(moduleAmount + penaltyAmount + interestAmount);
  });
});
