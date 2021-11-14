export default class Age {
  value: number;

  constructor(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const remaingMonthsToBirthday = today.getMonth() - birthDate.getMonth();
    const beforeBirthday =
      remaingMonthsToBirthday < 0 ||
      (remaingMonthsToBirthday === 0 && today.getDate() < birthDate.getDate());
    if (beforeBirthday) {
      age--;
    }
    this.value = age;
  }

  toString(): string {
    return this.value.toString();
  }
}
