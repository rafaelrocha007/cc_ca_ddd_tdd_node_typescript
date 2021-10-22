import ClassRepository from "./ClassRepository";

export default class ClassRepositoryMemory implements ClassRepository {
  classes: any[];

  constructor() {
    this.classes = [
      {
        level: "EM",
        module: "3",
        code: "A",
        capacity: 2,
      },
    ];
  }

  findByCode(level: string, module: string, code: string) {
    const clazz = this.classes.find(
      (clazz: any) =>
        clazz.code === code && clazz.module === module && clazz.level === level
    );
    if (!clazz) throw new Error("Class not found");
    return clazz;
  }
}
