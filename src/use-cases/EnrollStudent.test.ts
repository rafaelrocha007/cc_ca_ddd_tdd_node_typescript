import EnrollmentRepository from "../EnrollmentRepository";
import EnrollmentRepositoryMemory from "../EnrollmentRepositoryMemory";
import LevelRepository from "../LevelRepository";
import LevelRepositoryMemory from "../LevelRepositoryMemory";
import ModuleRepository from "../ModuleRepository";
import ModuleRepositoryMemory from "../ModuleRepositoryMemory";
import EnrollStudent from "./EnrollStudent";

let enrollmentRepository: EnrollmentRepository;
let levelRepository: LevelRepository;
let moduleRepository: ModuleRepository;

let enrollStudent: EnrollStudent;
describe("Enroll Student use case", () => {
  beforeEach(function () {
    enrollmentRepository = new EnrollmentRepositoryMemory();
    levelRepository = new LevelRepositoryMemory();
    moduleRepository = new ModuleRepositoryMemory();
    enrollStudent = new EnrollStudent(
      levelRepository,
      moduleRepository,
      enrollmentRepository
    );
  });

  test("Should not enroll student without valid student name", () => {
    expect(() =>
      enrollStudent.execute({
        student: {
          name: "Ana",
        },
      })
    ).toThrow(new Error("Invalid name"));
  });

  test("Should not enroll without valid student cpf", () => {
    expect(() =>
      enrollStudent.execute({
        student: {
          name: "Ana Silva",
          cpf: "123.456.789-99",
        },
      })
    ).toThrow(new Error("Invalid cpf"));
  });

  test("Should not enroll duplicated student", () => {
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
    enrollStudent.execute(enrollmentRequest);
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(
      new Error("Enrollment with duplicated student is not allowed")
    );
  });

  test("Should enroll a valid student", () => {
    enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    expect(enrollmentRepository.enrollments.length).toBe(1);
    enrollStudent.execute({
      student: {
        name: "Rafael Rocha",
        cpf: "088.192.736-83",
        birthDate: "2002-09-13",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    expect(enrollmentRepository.enrollments.length).toBe(2);
  });

  test("Should generate enrollment code", () => {
    enrollStudent.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });

    expect(enrollmentRepository.enrollments[0].code).toBe("2021EM3A0001");
  });

  test("Should not enroll student below minimum age", () => {
    expect(() => {
      enrollStudent.execute({
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2010-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
    }).toThrow(new Error("Student below minimum age"));
  });

  test("Should not enroll student over class capacity", () => {
    expect(() => {
      enrollStudent.execute({
        student: {
          name: "Aluno Teste Um",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      enrollStudent.execute({
        student: {
          name: "Aluno Teste Dois",
          cpf: "75706622027",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      enrollStudent.execute({
        student: {
          name: "Aluno Teste Três",
          cpf: "90287586073",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
    }).toThrow(new Error("Class is over capacity"));
  });
});
