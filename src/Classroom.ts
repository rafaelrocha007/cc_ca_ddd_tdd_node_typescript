export default class Classroom {
  level: string;
  module: string;
  code: string;
  capacity: number;
  startDate: Date;
  endDate: Date;

  constructor({
    level,
    module,
    code,
    capacity,
    startDate,
    endDate,
  }: {
    level: string;
    module: string;
    code: string;
    capacity: number;
    startDate: string;
    endDate: string;
  }) {
    this.level = level;
    this.module = module;
    this.code = code;
    this.capacity = capacity;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}
