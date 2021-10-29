export default class Classroom {
  level: string;
  module: string;
  code: string;
  capacity: number;
  start_date: Date;
  end_date: Date;

  constructor({
    level,
    module,
    code,
    capacity,
    start_date,
    end_date,
  }: {
    level: string;
    module: string;
    code: string;
    capacity: number;
    start_date: string;
    end_date: string;
  }) {
    this.level = level;
    this.module = module;
    this.code = code;
    this.capacity = capacity;
    this.start_date = new Date(start_date);
    this.end_date = new Date(end_date);
  }
}
