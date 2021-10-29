export default class Period {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  getDiffInMilli() {
    return this.end.getTime() - this.start.getTime();
  }

  getDiffInDays() {
    const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
    return this.getDiffInMilli() / MILLISECONDS_IN_A_DAY;
  }
}
