import Module from "../../../domain/entity/Module";
import ModuleRepository from "../../../domain/repository/ModuleRepository";

export default class ModuleRepositoryMemory implements ModuleRepository {
  modules: Module[];

  constructor() {
    this.modules = [
      new Module({
        level: "EF1",
        code: "1",
        description: "1o Ano",
        minimumAge: 6,
        price: 1500000,
      }),
      new Module({
        level: "EF1",
        code: "2",
        description: "2o Ano",
        minimumAge: 7,
        price: 1500000,
      }),
      new Module({
        level: "EF1",
        code: "3",
        description: "3o Ano",
        minimumAge: 8,
        price: 1500000,
      }),
      new Module({
        level: "EF1",
        code: "4",
        description: "4o Ano",
        minimumAge: 9,
        price: 1500000,
      }),
      new Module({
        level: "EF1",
        code: "5",
        description: "5o Ano",
        minimumAge: 10,
        price: 1500000,
      }),
      new Module({
        level: "EF2",
        code: "6",
        description: "6o Ano",
        minimumAge: 11,
        price: 1400000,
      }),
      new Module({
        level: "EF2",
        code: "7",
        description: "7o Ano",
        minimumAge: 12,
        price: 1400000,
      }),
      new Module({
        level: "EF2",
        code: "8",
        description: "8o Ano",
        minimumAge: 13,
        price: 1400000,
      }),
      new Module({
        level: "EF2",
        code: "9",
        description: "9o Ano",
        minimumAge: 14,
        price: 1400000,
      }),
      new Module({
        level: "EM",
        code: "1",
        description: "1o Ano",
        minimumAge: 15,
        price: 1700000,
      }),
      new Module({
        level: "EM",
        code: "2",
        description: "2o Ano",
        minimumAge: 16,
        price: 1700000,
      }),
      new Module({
        level: "EM",
        code: "3",
        description: "3o Ano",
        minimumAge: 17,
        price: 1700000,
      }),
    ];
  }

  async findByCode(levelCode: string, code: string): Promise<Module> {
    const module = this.modules.find(
      (mod) => mod.code === code && mod.level === levelCode
    );
    if (!module) {
      throw new Error("Module not found");
    }
    return Promise.resolve(module);
  }
}
