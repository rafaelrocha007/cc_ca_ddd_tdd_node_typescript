export default class Invoice {
  static readonly STATUS_WAITING_PAYMENT: number = 0;
  static readonly STATUS_PAID: number = 1;

  code: string;
  month: number;
  year: number;
  amount: number;
  status: number;

  constructor(
    code: string,
    month: number,
    year: number,
    amount: number,
    status: number = Invoice.STATUS_WAITING_PAYMENT
  ) {
    this.code = code;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.status = status;
  }
}
