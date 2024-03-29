import Age from "./Age";
import Cpf from "./Cpf";
import Name from "./Name";

export default class Student {
  name: Name;
  cpf: Cpf;
  birthDate: Date;

  constructor(name: string, cpf: string, birthDate: string) {
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
    this.birthDate = new Date(birthDate);
  }

  getAge() {
    return new Age(this.birthDate).value;
  }
}
