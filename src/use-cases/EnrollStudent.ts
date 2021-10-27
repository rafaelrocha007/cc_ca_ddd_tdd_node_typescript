import EnrollmentCode from "../EnrollmentCode";
import Student from "../Student";
import EnrollmentRepository from "../EnrollmentRepository";
import LevelRepository from "../LevelRepository";
import ModuleRepository from "../ModuleRepository";
import ClassRepository from "../ClassRepository";
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
    const classEndDate = new Date(clazz.end_date);
    if (this.dateDiffInDays(new Date(), classEndDate) < 0) {
      throw new Error("Class is already finished");
    }
    const classStartDate = new Date(clazz.start_date);
    const totalDays = this.dateDiffInDays(classStartDate, classEndDate);
    const classDaysTillNow = this.dateDiffInDays(classStartDate, new Date());
    const classPercentageDone = (classDaysTillNow / totalDays) * 100;
    if (classPercentageDone >= 25) {
      throw new Error("Class is already started");
    }
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
    this.enrollmentRepository.save(enrollment);
    return true;
  }

  private dateDiffInDays = (date1: Date, date2: Date) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  };
}
