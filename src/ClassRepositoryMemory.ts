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
        start_date: "2021-06-01",
        end_date: "2021-12-15",
      },
      {
        level: "EM",
        module: "3",
        code: "B",
        capacity: 5,
        start_date: "2021-05-01",
        end_date: "2021-05-30",
      },
      {
        level: "EM",
        module: "3",
        code: "C",
        capacity: 5,
        start_date: "2021-05-01",
        end_date: "2021-06-30",
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
