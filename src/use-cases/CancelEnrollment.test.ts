import EnrollmentRepository from "../EnrollmentRepository";
import EnrollStudent from "./EnrollStudent";

import Enrollment from "../Enrollment";
import CancelEnrollment from "./CancelEnrollment";
import RepositoryMemoryFactory from "../RepositoryMemoryFactory";

let enrollStudent: EnrollStudent;
let cancelEnrollment: CancelEnrollment;

describe("Enroll Student use case", () => {
  beforeEach(function () {
    const repositoryFactory = new RepositoryMemoryFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    cancelEnrollment = new CancelEnrollment(repositoryFactory);
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
    const enrollment = enrollStudent.enrollmentRepository.get("2021EM3A0001");
    expect(enrollment.status).toBe(Enrollment.STATUS_CANCELLED);
  });
});
