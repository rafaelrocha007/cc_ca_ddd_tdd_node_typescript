import Student from "../Student";
import EnrollmentRepository from "../EnrollmentRepository";
import LevelRepository from "../LevelRepository";
import ModuleRepository from "../ModuleRepository";
import ClassRepository from "../ClassroomRepository";
import Enrollment from "../Enrollment";
import Invoice from "../Invoice";

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
    const classroom = this.classRepository.findByCode(
      level.code,
      module.code,
      enrollmentRequest.class
    );
    const existingEnrollment = this.enrollmentRepository.findByCpf(
      enrollmentRequest.student.cpf
    );
    if (existingEnrollment) {
      throw new Error("Enrollment with duplicated student is not allowed");
    }
    const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(
      level.code,
      module.code,
      classroom.code
    );
    if (studentsEnrolledInClass.length > classroom.capacity - 1) {
      throw new Error("Class is over capacity");
    }
    const enrollmentSequence = this.enrollmentRepository.count() + 1;
    const issueDate = new Date();
    const enrollment = new Enrollment(
      student,
      level,
      module,
      classroom,
      issueDate,
      enrollmentSequence
    );
    const installmentAmount =
      Math.round(
        (module.price / enrollmentRequest.installments) * 100 + Number.EPSILON
      ) / 100;
    let lastInstallmentAmount =
      module.price - installmentAmount * (enrollmentRequest.installments - 1);
    lastInstallmentAmount = parseFloat(lastInstallmentAmount.toFixed(2));
    for (
      let installment = 0;
      installment < enrollmentRequest.installments - 1;
      installment++
    ) {
      enrollment.addInvoice(new Invoice(installment, installmentAmount));
    }
    enrollment.addInvoice(
      new Invoice(enrollmentRequest.installments, lastInstallmentAmount)
    );
    this.enrollmentRepository.save(enrollment);
    return true;
  }
}
