import LevelRepository from "./LevelRepository";

export default class LevelRepositoryMemory implements LevelRepository {
  levels: any[];

  constructor() {
    this.levels = [
      {
        code: "EF1",
        description: "Ensino Fundamental I",
      },
      {
        code: "EF2",
        description: "Ensino Fundamental II",
      },
      {
        code: "EM",
        description: "Ensino Médio",
      },
    ];
  }

  findByCode(code: string): any {
    const level = this.levels.find((lvl: any) => lvl.code === code);
    if (!level) {
      throw new Error("Level not found");
    }
    return level;
  }
}
