export default class InvoiceEvent {
  static readonly TYPE_PAYMENT = "payment";
  static readonly TYPE_PENALTY = "penalty";
  static readonly TYPE_INTERESTS = "interests";

  type: string;
  amount: number;

  constructor(type: string, amount: number) {
    this.type = type;
    this.amount = amount;
  }
}
