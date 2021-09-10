import Student from "../Student";

export default class EnrollStudent {
  private enrollments: Array<any> = [];
  execute(enrollmentRequest: any) {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf
    );

    const existingEnrollment = this.enrollments.find(
      (enrollment) => enrollment.student.cpf === enrollmentRequest.student.cpf
    );

    if (existingEnrollment) {
      throw new Error("Enrollment with duplicated student is not allowed");
    }
    const enrollment = {
      student: {
        name: enrollmentRequest.student.name,
        cpf: enrollmentRequest.student.cpf,
      },
    };
    this.enrollments.push(enrollmentRequest);
    return true;
  }
}
