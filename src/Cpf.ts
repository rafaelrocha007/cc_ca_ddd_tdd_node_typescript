const FACTOR_FIRST_DIGIT = 10;
const FACTOR_SECOND_DIGIT = 11;

export default class Cpf {
  value: string;

  constructor(value: string) {
    if (!this.validateCpf(value)) {
      throw new Error("Invalid cpf");
    }
    this.value = value;
  }

  validateCpf(originalCpf = "") {
    const cpf = this.extractDigits(originalCpf);
    if (!this.isValidLength(cpf)) {
      return false;
    }
    if (!this.isAllowed(cpf)) {
      return false;
    }
    const digit1 = this.calculateDigit(cpf, FACTOR_FIRST_DIGIT);
    const digit2 = this.calculateDigit(cpf, FACTOR_SECOND_DIGIT);
    const calculatedCheckDigit = `${digit1}${digit2}`;
    return this.getCheckDigit(cpf) == calculatedCheckDigit;
  }

  extractDigits(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  isValidLength(cpf: string) {
    return cpf.length === 11;
  }

  isAllowed(cpf: string) {
    const [firstDigit] = cpf;
    return !cpf.split("").every((char) => char === firstDigit);
  }

  calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of this.toDigitArray(cpf).slice(0, factor - 1)) {
      total += digit * factor--;
    }
    return total % 11 < 2 ? 0 : 11 - (total % 11);
  }

  toDigitArray(cpf: string) {
    return [...cpf].map((digit) => parseInt(digit));
  }

  getCheckDigit(cpf: string) {
    return cpf.slice(9);
  }
}
