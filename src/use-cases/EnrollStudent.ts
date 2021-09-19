import EnrollmentCode from "../EnrollmentCode";
import Student from "../Student";
import data from "../Data";
import Age from "../Age";

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
    const module = data.modules.find(
      (mod) => mod.code === moduleCode && mod.level === levelCode
    );
    const studentAge = new Age(new Date(enrollmentRequest.student.birthDate));
    if (!module) {
      throw new Error("Module not found");
    }
    if (module.minimumAge > studentAge.value) {
      throw new Error("Student below minimum age");
    }
    // console.log('request', levelCode, moduleCode, classCode);
    const currentClass = data.classes.find(
      (classItem) =>
        classItem.code === classCode &&
        classItem.module === moduleCode &&
        classItem.level === levelCode
    );
    if (!currentClass) {
      throw new Error("Class not found");
    }
    const classEnrollments = this.enrollments.filter(
      (enrollment) =>
        enrollment.class === classCode &&
        enrollment.module === moduleCode &&
        enrollment.level === levelCode
    );
    if (classEnrollments.length > currentClass.capacity - 1) {
      throw new Error("Class is over capacity");
    }
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
