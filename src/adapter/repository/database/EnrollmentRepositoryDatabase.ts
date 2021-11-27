import Enrollment from "../../../domain/entity/Enrollment";
import Invoice from "../../../domain/entity/Invoice";
import InvoiceEvent from "../../../domain/entity/InvoiceEvent";
import Student from "../../../domain/entity/Student";
import ClassroomRepository from "../../../domain/repository/ClassroomRepository";
import EnrollmentRepository from "../../../domain/repository/EnrollmentRepository";
import LevelRepository from "../../../domain/repository/LevelRepository";
import ModuleRepository from "../../../domain/repository/ModuleRepository";
import MySqlConnectionPool from "../../../infra/database/MySqlConnectionPool";
import ClassroomRepositoryDatabase from "./ClassroomRepositoryDatabase";
import LevelRepositoryDatabase from "./LevelRepositoryDatabase";
import ModuleRepositoryDatabase from "./ModuleRepositoryDatabase";

export default class EnrollmentRepositoryDatabase
  implements EnrollmentRepository
{
  levelRepository: LevelRepositoryDatabase;
  moduleRepository: ModuleRepositoryDatabase;
  classroomRepository: ClassroomRepositoryDatabase;

  constructor(
    levelRepository: LevelRepository,
    moduleRepository: ModuleRepository,
    classroomRepository: ClassroomRepository
  ) {
    this.levelRepository = levelRepository;
    this.moduleRepository = moduleRepository;
    this.classroomRepository = classroomRepository;
  }

  updateStatus(code: string, status: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async get(code: string): Promise<Enrollment | undefined> {
    const enrollmentData = await MySqlConnectionPool.one(
      "select * from enrollment where code = ?",
      [code]
      );
    if (!enrollmentData) return Promise.resolve(undefined);
    const studentData = await MySqlConnectionPool.one(
      "select * from student where cpf = ?",
      [enrollmentData.student]
    );
    const student = new Student(
      studentData.name,
      studentData.cpf,
      studentData.birth_date
    );
    const level = await this.levelRepository.findByCode(enrollmentData.level);
    const module = await this.moduleRepository.findByCode(
      enrollmentData.level,
      enrollmentData.module
    );
    const classroom = await this.classroomRepository.findByCode(
      enrollmentData.level,
      enrollmentData.module,
      enrollmentData.classroom
    );
    const enrollment = new Enrollment(
      student,
      level,
      module,
      classroom,
      enrollmentData.issue_date,
      enrollmentData.sequence,
      enrollmentData.installments
    );
    const invoicesData = await MySqlConnectionPool.query(
      "select * from invoice where enrollment = ?",
      [code]
    );
    const invoices = [];
    for (const invoiceData of invoicesData) {
      const invoice = new Invoice(
        code,
        invoiceData.month,
        invoiceData.year,
        parseInt(invoiceData.amount)
      );
      const invoiceEvents = [];
      const invoiceEventsData = await MySqlConnectionPool.query(
        "select * from invoice_event where enrollment = ? and month = ? and year = ?",
        [code, invoiceData.month, invoiceData.year]
      );
      for (const invoiceEventData of invoiceEventsData) {
        const invoiceEvent = new InvoiceEvent(
          invoiceEventData.type,
          invoiceEventData.amount
        );
        invoiceEvents.push(invoiceEvent);
      }
      invoice.events = invoiceEvents;
      invoices.push(invoice);
    }
    enrollment.invoices = invoices;
    return enrollment;
  }

  async save(enrollment: Enrollment): Promise<void> {
    try {
      await MySqlConnectionPool.query(
        "insert into enrollment (code, sequence, level, module, classroom, student, installments, issue_date, status) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          enrollment.code.value,
          enrollment.sequence,
          enrollment.level.code,
          enrollment.module.code,
          enrollment.classroom.code,
          enrollment.student.cpf.value,
          enrollment.installments,
          enrollment.issueDate,
          enrollment.status,
        ]
      );
    } catch (e) {
      console.log(e);
    }
    await MySqlConnectionPool.one(
      "insert into student (name, cpf, birth_date) values (?, ?, ?)",
      [
        enrollment.student.name.value,
        enrollment.student.cpf.value,
        enrollment.student.birthDate,
      ]
    );
    for (const invoice of enrollment.invoices) {
      await MySqlConnectionPool.one(
        "insert into invoice (enrollment, month, year, due_date, amount) values (?, ?, ?, ?, ?)",
        [
          enrollment.code.value,
          invoice.month,
          invoice.year,
          invoice.dueDate,
          invoice.amount,
        ]
      );
    }
  }

  async update(enrollment: Enrollment): Promise<void> {
    await MySqlConnectionPool.none(
      "update enrollment set status = ? where code = ?",
      [enrollment.status, enrollment.code.value]
    );
    for (const invoice of enrollment.invoices) {
      for (const invoiceEvent of invoice.events) {
        await MySqlConnectionPool.none(
          "insert into invoice_event (enrollment, month, year, type, amount) values (?, ?, ?, ?, ?) on conflict do nothing",
          [
            enrollment.code.value,
            invoice.month,
            invoice.year,
            invoiceEvent.type,
            invoiceEvent.amount,
          ]
        );
      }
    }
  }

  async findAllByClassroom(
    level: string,
    module: string,
    classroom: string
  ): Promise<Enrollment[]> {
    const enrollmentsData = await MySqlConnectionPool.query(
      "select * from enrollment where level = ? and module = ? and classroom = ?",
      [level, module, classroom]
    );
    const enrollments = [];
    for (const enrollmentData of enrollmentsData) {
      const enrollment = await this.get(enrollmentData.code);
      if (enrollment) {
        enrollments.push(enrollment);
      }
    }
    return enrollments;
  }

  async findByCpf(cpf: string): Promise<Enrollment | undefined> {
    const enrollmentData = await MySqlConnectionPool.oneOrNone(
      "select * from enrollment where student = ?",
      [cpf]
    );
    if (!enrollmentData) {
      return Promise.resolve(undefined);
    }
    return this.get(enrollmentData.code);
  }

  async count(): Promise<number> {
    const enrollments = await MySqlConnectionPool.one(
      "select count(*) as count from enrollment",
      []
    );
    return enrollments.count;
  }

  async clean(): Promise<void> {
    await MySqlConnectionPool.query("delete from invoice_event", []);
    await MySqlConnectionPool.query("delete from invoice", []);
    await MySqlConnectionPool.query("delete from enrollment", []);
    await MySqlConnectionPool.query("delete from student", []);
  }
}
