export default class Invoice {
  installment: number;
  amount: number;

  constructor(installment: number, amount: number) {
    this.installment = installment;
    this.amount = amount;
  }
}
