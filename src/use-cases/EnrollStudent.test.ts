import EnrollStudent from "./EnrollStudent";

describe("Enroll Student use case", () => {
  test("Should not enroll student without valid student name", () => {
    const sut = new EnrollStudent();

    expect(() =>
      sut.execute({
        student: {
          name: "Ana",
        },
      })
    ).toThrow(new Error("Invalid name"));
  });

  test("Should not enroll without valid student cpf", () => {
    const sut = new EnrollStudent();
    expect(() =>
      sut.execute({
        student: {
          name: "Ana Silva",
          cpf: "123.456.789-99",
        },
      })
    ).toThrow(new Error("Invalid cpf"));
  });

  test("Should not enroll duplicated student", () => {
    const sut = new EnrollStudent();
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
    sut.execute(enrollmentRequest);
    expect(() => sut.execute(enrollmentRequest)).toThrow(
      new Error("Enrollment with duplicated student is not allowed")
    );
  });

  test("Should enroll a valid student", () => {
    const sut = new EnrollStudent();
    sut.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    expect(sut.enrollments.length).toBe(1);
    sut.execute({
      student: {
        name: "Rafael Rocha",
        cpf: "088.192.736-83",
        birthDate: "2002-09-13",
      },
      level: "EM",
      module: "3",
      class: "A",
    });
    expect(sut.enrollments.length).toBe(2);
  });

  test("Should generate enrollment code", () => {
    const sut = new EnrollStudent();
    sut.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "3",
      class: "A",
    });

    expect(sut.enrollments[0].code).toBe("2021EM3A0001");
  });

  test("Should not enroll student below minimum age", () => {
    const sut = new EnrollStudent();
    expect(() => {
      sut.execute({
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
    const sut = new EnrollStudent();

    expect(() => {
      sut.execute({
        student: {
          name: "Aluno Teste Um",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      sut.execute({
        student: {
          name: "Aluno Teste Dois",
          cpf: "75706622027",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "3",
        class: "A",
      });
      sut.execute({
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
