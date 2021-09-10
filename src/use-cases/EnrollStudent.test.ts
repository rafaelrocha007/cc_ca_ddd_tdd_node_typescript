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
        name: "Ana Silva",
        cpf: "832.081.519-34",
      },
    });
    expect(() =>
      sut.execute({
        student: {
          name: "Ana Silva",
          cpf: "832.081.519-34",
        },
      })
    ).toThrow(new Error("Enrollment with duplicated student is not allowed"));
  });

  test("Should enroll a valid student", () => {
    const sut = new EnrollStudent();
    const enrollResult1 = sut.execute({
      student: {
        name: "Ana Silva",
        cpf: "832.081.519-34",
      },
    });
    expect(enrollResult1).toBe(true);
    const enrollResult2 = sut.execute({
      student: {
        name: "Rafael Rocha",
        cpf: "088.192.736-83",
      },
    });
    expect(enrollResult2).toBe(true);
  });
});
