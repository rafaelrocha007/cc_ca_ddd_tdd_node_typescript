import Enrollment from "../../entity/Enrollment";
import Student from "../../entity/Student";
import RepositoryAbstractFactory from "../../factory/RepositoryAbstractFactory";
import ClassroomRepository from "../../repository/ClassroomRepository";
import EnrollmentRepository from "../../repository/EnrollmentRepository";
import LevelRepository from "../../repository/LevelRepository";
import ModuleRepository from "../../repository/ModuleRepository";
import EnrollStudentInputData from "./EnrollStudentInputData";
import EnrollStudentOutputData from "./EnrollStudentOutputData";

export default class EnrollStudent {
  moduleRepository: ModuleRepository;
  levelRepository: LevelRepository;
  classRepository: ClassroomRepository;
  enrollmentRepository: EnrollmentRepository;

  constructor(repositoryFactory: RepositoryAbstractFactory) {
    this.levelRepository = repositoryFactory.createLevelRepository();
    this.moduleRepository = repositoryFactory.createModuleRepository();
    this.classRepository = repositoryFactory.createClassroomRepository();
    this.enrollmentRepository = repositoryFactory.createEnrollmentRepository();
  }

  async execute(enrollmentRequest: EnrollStudentInputData): Promise<EnrollStudentOutputData> {
    const student = new Student(
      enrollmentRequest.studentName,
      enrollmentRequest.studentCpf,
      enrollmentRequest.studentBirthDate
    );
    const level = await this.levelRepository.findByCode(
      enrollmentRequest.level
    );
    const module = await this.moduleRepository.findByCode(
      enrollmentRequest.level,
      enrollmentRequest.module
    );
    const classroom = await this.classRepository.findByCode(
      level.code,
      module.code,
      enrollmentRequest.classroom
    );
    const existingEnrollment = await this.enrollmentRepository.findByCpf(
      enrollmentRequest.studentCpf
    );
    if (existingEnrollment) {
      throw new Error("Enrollment with duplicated student is not allowed")
    }
    const studentsEnrolledInClass =
      await this.enrollmentRepository.findAllByClassroom(
        level.code,
        module.code,
        classroom.code
      );
    if (studentsEnrolledInClass.length > classroom.capacity - 1) {
      throw new Error("Class is over capacity");
    }
    const enrollmentSequence = (await this.enrollmentRepository.count()) + 1;
    const issueDate = new Date();
    const enrollment = new Enrollment(
      student,
      level,
      module,
      classroom,
      issueDate,
      enrollmentSequence,
      enrollmentRequest.installments
    );
    await this.enrollmentRepository.save(enrollment);

    return new EnrollStudentOutputData('',0,'');
  }
}
