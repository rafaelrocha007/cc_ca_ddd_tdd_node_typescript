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
  balance: number = 0;

  constructor(
    student: Student,
    level: Level,
    module: Module,
    classroom: Classroom,
    issueDate: Date,
    sequence: number,
    installments: number = 12
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
    for (let installment = 1; installment <= this.installments; installment++) {
      this.invoices.push(
        new Invoice(
          this.getCode(),
          installment,
          this.issueDate.getFullYear(),
          installmentAmount
        )
      );
    }
    const total = this.invoices.reduce((total, invoice) => {
      total += invoice.amount;
      return total;
    }, 0);
    const rest = parseFloat((this.module.price - total).toFixed(2));
    this.invoices[this.invoices.length - 1].amount += rest;
  }

  getBalance(): number {
    return (
      this.invoices.reduce((total, invoice) => {
        total += invoice.status === Invoice.STATUS_PAID ? invoice.amount : 0;
        return total;
      }, 0) - this.module.price
    );
  }
}
