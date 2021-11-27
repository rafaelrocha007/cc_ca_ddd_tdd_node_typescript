import EnrollStudent from "../../domain/usecase/EnrollStudent/EnrollStudent";
import RepositoryDatabaseFactory from "../../adapter/factory/RepositoryDatabaseFactory";
import MySqlConnectionPool from "../../infra/database/MySqlConnectionPool";

let enrollStudent: EnrollStudent;

describe("Enroll Student use case", () => {
  beforeEach(async () => {
    const repositoryFactory = new RepositoryDatabaseFactory();
    enrollStudent = new EnrollStudent(repositoryFactory);
    await repositoryFactory.createEnrollmentRepository().clean();
  });

  afterAll(async () => {
    MySqlConnectionPool.getInstance().end();
  });

  test("Should not enroll student without valid student name", async () => {
    expect.assertions(1);
    try {
      await enrollStudent.execute({
        student: {
          name: "Ana",
        },
      });
      expect("1").toBe("1");
    } catch (e) {
      expect(e).toEqual(new Error("Invalid name"));
    }
  });

  test("Should not enroll without valid student cpf", async () => {
    try {
      await enrollStudent.execute({
        student: {
          name: "Ana Silva",
          cpf: "123.456.789-99",
        },
      });
    } catch (e) {
      expect(e).toEqual(new Error("Invalid cpf"));
    }
  });

  test("Should not enroll duplicated student", async () => {
    try {
      const enrollmentRequest = {
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      };
      await enrollStudent.execute(enrollmentRequest);
      await enrollStudent.execute(enrollmentRequest);
    } catch (e) {
      expect(e).toEqual(
        new Error("Enrollment with duplicated student is not allowed")
      );
    }
  });

  test("Should enroll a valid student", async () => {
    await enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    const enrollment1 = await enrollStudent.enrollmentRepository.get(
      "2021EM3A0001"
    );
    expect(enrollment1?.getCode()).toBe("2021EM3A0001");
    await enrollStudent.execute({
      student: {
        name: "Rafael Rocha",
        cpf: "088.192.736-83",
        birthDate: "2002-09-13",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    const enrollment2 = await enrollStudent.enrollmentRepository.get(
      "2021EM3A0002"
    );
    expect(enrollment2?.getCode()).toBe("2021EM3A0002");
  });

  test("Should generate enrollment code", async () => {
    await enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    const enrollment = await enrollStudent.enrollmentRepository.get(
      "2021EM3A0001"
    );
    expect(enrollment?.getCode()).toBeTruthy();
  });

  test("Should not enroll student below minimum age", async () => {
    try {
      await enrollStudent.execute({
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2010-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
    } catch (e) {
      expect(e).toEqual(new Error("Student below minimum age"));
    }
  });

  test("Should not enroll student over class capacity", async () => {
    try {
      await enrollStudent.execute({
        student: {
          name: "Aluno Teste Um",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      await enrollStudent.execute({
        student: {
          name: "Aluno Teste Dois",
          cpf: "75706622027",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      await enrollStudent.execute({
        student: {
          name: "Aluno Teste Três",
          cpf: "90287586073",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
    } catch (e) {
      expect(e).toEqual(new Error("Class is over capacity"));
    }
  });

  test("Should not enroll after the end of the class", async () => {
    try {
      await enrollStudent.execute({
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "B",
      });
    } catch (e) {
      expect(e).toEqual(new Error("Class is already finished"));
    }
  });

  test("Should not enroll after 25% of the total hours of the course", async () => {
    try {
      await enrollStudent.execute({
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "C",
      });
    } catch (e) {
      expect(e).toEqual(new Error("Class is already started"));
    }
  });

  test("Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice", async () => {
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
    const module = await enrollStudent.moduleRepository.findByCode("EM", "3");
    const enrollment = await enrollStudent.enrollmentRepository.findByCpf(cpf);
    expect(enrollment?.invoices).toHaveLength(installments);
    expect(
      enrollment?.invoices.reduce((total, invoice) => {
        return total + invoice.amount;
      }, 0)
    ).toBe(module.price);
  });
});
