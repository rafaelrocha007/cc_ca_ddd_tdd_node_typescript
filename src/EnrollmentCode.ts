export default class EnrollmentCode {
  value: string;

  constructor(
    year: string,
    levelCode: string,
    moduleCode: string,
    classCode: string,
    sequence: string
  ) {
    if (!year || year.length != 4) {
      throw new Error("Full Year must be provided");
    }
    if (!levelCode) {
      throw new Error("Level must be provided");
    }
    if (!moduleCode) {
      throw new Error("Module must be provided");
    }
    if (!classCode) {
      throw new Error("Class must be provided");
    }
    if (!sequence) {
      throw new Error("Sequence must be provided");
    }
    this.value =
      year + levelCode + moduleCode + classCode + sequence.padStart(4, "0");
  }
}
