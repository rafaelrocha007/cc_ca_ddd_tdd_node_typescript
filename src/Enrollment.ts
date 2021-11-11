import Classroom from "./Classroom";
import EnrollmentCode from "./EnrollmentCode";
import Invoice from "./Invoice";
import InvoiceEvent from "./InvoiceEvent";
import Level from "./Level";
import Module from "./Module";
import Student from "./Student";

export default class Enrollment {
  static readonly STATUS_ACTIVE = "active";
  static readonly STATUS_CANCELLED = "cancelled";

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
  status: string;

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
    this.status = Enrollment.STATUS_ACTIVE;
    this.generateInvoices();
  }

  getCode(): string {
    return this.code.value;
  }

  generateInvoices() {
    const installmentAmount = Math.trunc(this.module.price / this.installments);
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
    const rest = this.module.price - total;
    this.invoices[this.invoices.length - 1].amount += rest;
  }

  getInvoiceBalance(currentDate: Date): number {
    return this.invoices.reduce((total, invoice) => {
      total += invoice.getBalance(currentDate);
      return total;
    }, 0);
  }

  getInvoice(month: number, year: number): Invoice {
    const invoice = this.invoices.find(
      (invoice) => invoice.month === month && invoice.year === year
    );
    if (!invoice) {
      throw new Error("Invalid invoice");
    }
    return invoice;
  }

  payInvoice(month: number, year: number, amount: number, currentDate: Date) {
    const invoice = this.getInvoice(month, year);
    if (invoice.getBalance(currentDate) != amount) {
      throw new Error("Only full installment amount is accepted");
    }
    invoice.addEvent(new InvoiceEvent("payment", invoice.amount));
    invoice.addEvent(
      new InvoiceEvent("interest", invoice.getInterest(currentDate))
    );
    invoice.addEvent(
      new InvoiceEvent("penalty", invoice.getPenalty(currentDate))
    );
  }
}
