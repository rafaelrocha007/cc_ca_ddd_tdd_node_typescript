export default class Age {
  value: number;

  constructor(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.value = age;
  }
}
