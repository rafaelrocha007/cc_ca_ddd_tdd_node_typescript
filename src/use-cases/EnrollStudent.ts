import EnrollmentCode from "../EnrollmentCode";
import Student from "../Student";
import EnrollmentRepository from "../EnrollmentRepository";
import LevelRepository from "../LevelRepository";
import ModuleRepository from "../ModuleRepository";
import ClassRepository from "./ClassRepository";
import Enrollment from "../Enrollment";

export default class EnrollStudent {
  moduleRepository: ModuleRepository;
  levelRepository: LevelRepository;
  classRepository: ClassRepository;
  enrollmentRepository: EnrollmentRepository;

  constructor(
    levelRepository: LevelRepository,
    moduleRepository: ModuleRepository,
    classRepository: ClassRepository,
    enrollmentRepository: EnrollmentRepository
  ) {
    this.levelRepository = levelRepository;
    this.moduleRepository = moduleRepository;
    this.classRepository = classRepository;
    this.enrollmentRepository = enrollmentRepository;
  }

  execute(enrollmentRequest: any) {
    const student = new Student(
      enrollmentRequest.student.name,
      enrollmentRequest.student.cpf,
      enrollmentRequest.student.birthDate
    );
    const level = this.levelRepository.findByCode(enrollmentRequest.level);
    const module = this.moduleRepository.findByCode(
      enrollmentRequest.level,
      enrollmentRequest.module
    );
    const clazz = this.classRepository.findByCode(
      level.code,
      module.code,
      enrollmentRequest.class
    );
    if (student.getAge() < module.minimumAge) {
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
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      level.code,
      module.code,
      clazz.code
    );
    if (studentsEnrolledInClass.length > clazz.capacity - 1) {
      throw new Error("Class is over capacity");
    }
    const enrollment = new Enrollment(
      student,
      level.code,
      module.code,
      clazz.code, 
      code
    );
    // const enrollment = {
    //   student: {
    //     name: enrollmentRequest.student.name,
    //     cpf: enrollmentRequest.student.cpf,
    //   },
    //   level: level.code,
    //   module: module.code,
    //   class: clazz.code,
    //   code,
    // };
    this.enrollmentRepository.save(enrollment);
    return true;
  }
}
