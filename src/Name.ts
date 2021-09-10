export default class Name {
  value: string;

  constructor(value: string) {
    if (!/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/.test(value)) {
      throw new Error("Invalid name");
    }
    this.value = value;
  }
}
