import Classroom from "./Classroom";
import EnrollmentCode from "./EnrollmentCode";
import Invoice from "./Invoice";
import Level from "./Level";
import Module from "./Module";
import Student from "./Student";

export default class Enrollment {
  student: Student;
  level: Level;
  module: Module;
  classroom: Classroom;
  code: EnrollmentCode;
  sequence: number;
  issueDate: Date;
  invoices: Invoice[];
  installments: number;

  constructor(
    student: Student,
    level: Level,
    module: Module,
    classroom: Classroom,
    issueDate: Date,
    sequence: number,
    installments: number
  ) {
    if (student.getAge() < module.minimumAge) {
      throw new Error("Student below minimum age");
    }
    if (classroom.isFinished(issueDate)) {
      throw new Error("Class is already finished");
    }
    if (classroom.getProgress(issueDate) > 25) {
      throw new Error("Class is already started");
    }
    this.student = student;
    this.level = level;
    this.module = module;
    this.classroom = classroom;
    this.sequence = sequence;
    this.issueDate = issueDate;
    this.invoices = [];
    this.installments = installments;
    this.code = new EnrollmentCode(
      level.code,
      module.code,
      classroom.code,
      issueDate,
      sequence
    );
    this.generateInvoices();
  }

  getCode(): string {
    return this.code.value;
  }

  generateInvoices() {
    const installmentAmount =
      Math.trunc((this.module.price / this.installments) * 100) / 100;
    let lastInstallmentAmount =
      this.module.price - installmentAmount * (this.installments - 1);
    lastInstallmentAmount = parseFloat(lastInstallmentAmount.toFixed(2));
    for (
      let installment = 1;
      installment <= this.installments - 1;
      installment++
    ) {
      this.invoices.push(new Invoice(installment, installmentAmount));
    }
    this.invoices.push(new Invoice(this.installments, lastInstallmentAmount));
  }
}
