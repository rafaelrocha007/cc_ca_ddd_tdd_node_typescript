export default class PayInvoiceInputData {
  code: string;
  month: number;
  year: number;
  amount: number;
  paymentDate: Date;

  constructor(
    code: string,
    month: number,
    year: number,
    amount: number,
    paymentDate: Date
  ) {
    this.code = code;
    this.month = month;
    this.year = year;
    this.amount = amount;
    this.paymentDate = paymentDate;
  }
}
