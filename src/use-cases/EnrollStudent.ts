import EnrollmentCode from "../EnrollmentCode";
import Student from "../Student";
import data from "../Data";
import Age from "../Age";
import EnrollmentRepository from "../EnrollmentRepository";
import LevelRepository from "../LevelRepository";
import LevelRepositoryMemory from "../LevelRepositoryMemory";

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository;
  levelRepository: LevelRepository;

  constructor(
    levelRepository: LevelRepository,
    enrollmentRepository: EnrollmentRepository
  ) {
    this.enrollmentRepository = enrollmentRepository;
    this.levelRepository = levelRepository;
  }

  execute(enrollmentRequest: any) {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf
    );
    const level = this.levelRepository.findByCode(enrollmentRequest.level);
    const module = data.modules.find(
      (mod) =>
        mod.code === enrollmentRequest.module &&
        mod.level === enrollmentRequest.level
    );
    if (!module) {
      throw new Error("Module not found");
    }
    const clazz = data.classes.find(
      (classItem) => classItem.code === enrollmentRequest.class
    );
    if (!clazz) throw new Error("Class not found");
    const studentAge = new Age(new Date(enrollmentRequest.student.birthDate));
    if (module.minimumAge > studentAge.value) {
      throw new Error("Student below minimum age");
    }
    const existingEnrollment = this.enrollmentRepository.findByCpf(
      enrollmentRequest.student.cpf
    );
    if (existingEnrollment) {
      throw new Error("Enrollment with duplicated student is not allowed");
    }
    const code = new EnrollmentCode(
      new Date().getFullYear().toString(),
      level.code,
      module.code,
      clazz.code,
      (this.enrollmentRepository.count() + 1).toString()
    ).value;
    const currentClass = data.classes.find(
      (classItem) =>
        classItem.code === clazz.code &&
        classItem.module === module.code &&
        classItem.level === level.code
    );
    if (!currentClass) throw new Error("Class not found");
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      level.code,
      module.code,
      clazz.code
    );
    if (studentsEnrolledInClass.length > currentClass.capacity - 1) {
      throw new Error("Class is over capacity");
    }
    const enrollment = {
      student: {
        name: enrollmentRequest.student.name,
        cpf: enrollmentRequest.student.cpf,
      },
      level: level.code,
      module: module.code,
      class: clazz.code,
      code,
    };
    this.enrollmentRepository.save(enrollment);
    return true;
  }
}
