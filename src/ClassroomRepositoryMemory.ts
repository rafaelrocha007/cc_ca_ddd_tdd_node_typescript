import Classroom from "./Classroom";
import ClassroomRepository from "./ClassroomRepository";

export default class ClassroomRepositoryMemory implements ClassroomRepository {
  classrooms: Classroom[];

  constructor() {
    this.classrooms = [
      new Classroom({
        level: "EM",
        module: "3",
        code: "A",
        capacity: 2,
        startDate: new Date("2021-10-25"),
        endDate: new Date("2022-10-25"),
      }),
      new Classroom({
        level: "EM",
        module: "3",
        code: "B",
        capacity: 5,
        startDate: new Date("2021-05-01"),
        endDate: new Date("2021-05-30"),
      }),
      new Classroom({
        level: "EM",
        module: "3",
        code: "C",
        capacity: 5,
        startDate: new Date("2021-05-01"),
        endDate: new Date("2021-11-30"),
      }),
    ];
  }

  findByCode(level: string, module: string, code: string): Classroom {
    const clazz = this.classrooms.find(
      (clazz: any) =>
        clazz.code === code && clazz.module === module && clazz.level === level
    );
    if (!clazz) throw new Error("Class not found");
    return clazz;
  }
}
