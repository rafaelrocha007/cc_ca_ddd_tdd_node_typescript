export default class Invoice {
  installment: number;
  value: number;

  constructor(installment: number, value: number) {
    this.installment = installment;
    this.value = value;
  }
}
