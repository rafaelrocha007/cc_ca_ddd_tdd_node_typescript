import Period from "../../Period";
import InvoiceEvent from "./InvoiceEvent";

export default class Invoice {
  public static STATUS_OPEN = "open";
  public static STATUS_OVERDUE = "overdue";
  public static STATUS_PAID = "paid";

  code: string;
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  events: InvoiceEvent[];

  constructor(code: string, month: number, year: number, amount: number) {
    this.code = code;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.dueDate = new Date(year, month - 1, 5);
    this.events = [];
  }

  addEvent(invoiceEvent: InvoiceEvent) {
    this.events.push(invoiceEvent);
  }

  getBalance(): number {
    return this.events.reduce((total, event) => {
      if (event.type === InvoiceEvent.TYPE_PAYMENT) total -= event.amount;
      if (event.type === InvoiceEvent.TYPE_PENALTY) total += event.amount;
      if (event.type === InvoiceEvent.TYPE_INTERESTS) total += event.amount;
      return total;
    }, this.amount);
  }

  getStatus(currentDate: Date) {
    if (this.getBalance() == 0) return Invoice.STATUS_PAID;
    const overduePeriod = new Period(this.dueDate, currentDate);
    if (overduePeriod.getDiffInDays() > 0) return Invoice.STATUS_OVERDUE;
    return Invoice.STATUS_OPEN;
  }

  getPenalty(currentDate: Date) {
    const balance: number = this.getBalance();
    if (balance === 0) return 0;
    const overduePeriod = new Period(this.dueDate, currentDate);
    if (overduePeriod.getDiffInDays() <= 0) return 0;
    return Math.trunc(balance * 0.1);
  }

  getInterests(currentDate: Date) {
    const balance: number = this.getBalance();
    if (balance === 0) return 0;
    const overduePeriod = new Period(this.dueDate, currentDate);
    if (overduePeriod.getDiffInDays() <= 0) return 0;
    const interestAmount = balance * 0.01 * overduePeriod.getDiffInDays();
    return Math.trunc(interestAmount);
  }
}
