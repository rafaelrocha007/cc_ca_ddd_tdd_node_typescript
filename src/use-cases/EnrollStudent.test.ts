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
    sut.execute({
      student: {
        name: "Maria Carolina Fonseca",
        cpf: "755.525.774-26",
        birthDate: "2002-03-12",
      },
      level: "EM",
      module: "1",
      class: "A",
    });
    expect(() =>
      sut.execute({
        student: {
          name: "Maria Carolina Fonseca",
          cpf: "755.525.774-26",
          birthDate: "2002-03-12",
        },
        level: "EM",
        module: "1",
        class: "A",
      })
    ).toThrow(new Error("Enrollment with duplicated student is not allowed"));
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
      module: "1",
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
      module: "1",
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
      module: "1",
      class: "A",
    });

    expect(sut.enrollments[0].code).toBe("2021EM1A0001");
  });
});
