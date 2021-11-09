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

  getBalance(requestDate: Date) {
    const totalAmount =
      this.amount +
      this.getPenalty(requestDate) +
      this.getInterest(requestDate);

    const eventsTotalAmount = this.events.reduce((total, invoiceEvent) => {
      return (total += invoiceEvent.amount);
    }, 0);

    return totalAmount - eventsTotalAmount;
  }

  getStatus(requestDate: Date) {
    const dueDate = this.getDueDate();
    const overduePeriod = new Period(dueDate, requestDate);

    if (overduePeriod.getDiffInDays() > 0) {
      return Invoice.STATUS_OVERDUE;
    }
    return Invoice.STATUS_OPEN;
  }

  getDueDate() {
    return new Date(this.year, this.month, 5);
  }

  getPenalty(requestDate: Date) {
    if (this.getStatus(requestDate) === Invoice.STATUS_OPEN) {
      return 0;
    }
    return Math.trunc(this.amount * 0.1);
  }

  getInterest(requestDate: Date) {
    if (this.getStatus(requestDate) === Invoice.STATUS_OPEN) {
      return 0;
    }
    const overduePeriod = new Period(this.getDueDate(), requestDate);
    const interestAmount = this.amount * 0.01 * overduePeriod.getDiffInDays();
    return Math.trunc(interestAmount);
  }
}
