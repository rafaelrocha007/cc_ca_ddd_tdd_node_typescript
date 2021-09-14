import EnrollmentCode from "../EnrollmentCode";
import Student from "../Student";

export default class EnrollStudent {
  enrollments: Array<any> = [];
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

    const levelCode = enrollmentRequest.level;
    const moduleCode = enrollmentRequest.module;
    const classCode = enrollmentRequest.class;

    const code = new EnrollmentCode(
      new Date().getFullYear().toString(),
      levelCode,
      moduleCode,
      classCode,
      (this.enrollments.length + 1).toString()
    ).value;

    const enrollment = {
      student: {
        name: enrollmentRequest.student.name,
        cpf: enrollmentRequest.student.cpf,
      },
      level: levelCode,
      module: moduleCode,
      class: classCode,
      code,
    };

    this.enrollments.push(enrollment);
    return true;
  }
}
