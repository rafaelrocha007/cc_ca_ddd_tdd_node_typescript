export default class EnrollStudentOutputData {
  code: string;
  invoices: any[];
  balance: number;
  status: string;
  // invoices: {
  //   amount: number;
  //   penaltyAmount: number;
  //   interest: number;
  //   status: string;
  //   dueDate: Date;
  // };

  constructor(code: string, balance: number, status: string) {
    this.code = code;
    this.balance = balance;
    this.status = status;
    this.invoices = [];
  }
}
