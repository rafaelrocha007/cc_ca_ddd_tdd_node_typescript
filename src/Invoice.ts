import InvoiceEvent from "./InvoiceEvent";
import Period from "./Period";

export default class Invoice {
  public static STATUS_OPEN = "open";
  public static STATUS_OVERDUE = "overdue";

  code: string;
  month: number;
  year: number;
  amount: number;
  events: InvoiceEvent[];

  constructor(code: string, month: number, year: number, amount: number) {
    this.code = code;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.events = [];
  }

  addEvent(invoiceEvent: InvoiceEvent) {
    this.events.push(invoiceEvent);
  }

  getBalance() {
    return this.events.reduce((total, invoiceEvent) => {
      return (total -= invoiceEvent.amount);
    }, this.amount);
  }

  getStatus() {
    const now = new Date();
    const dueDate = this.getDueDate();
    const overduePeriod = new Period(dueDate, now);

    if (overduePeriod.getDiffInDays() > 0) {
      return Invoice.STATUS_OVERDUE;
    }
    return Invoice.STATUS_OPEN;
  }

  getDueDate() {
    return new Date(this.year, this.month, 5);
  }
}
