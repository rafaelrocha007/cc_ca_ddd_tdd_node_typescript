import mysql2 from "mysql2/promise";

export default class MySqlConnectionPool {
  private static instance: any;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = mysql2.createPool({
        host: "localhost",
        user: "root",
        database: "ccca_rodrigo_branas",
        password: "root",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return this.instance;
  }

  static async query(statement: string, params: any[]): Promise<any> {
    try {
      const result = await this.getInstance().query(statement, params);
      const [rows, meta] = result;
      return rows;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async one(statement: string, params: any[]): Promise<any> {
    try {
      const result = await this.getInstance().query(statement, params);
      const [rows, meta] = result;
      return rows[0];
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async oneOrNone(statement: string, params: any[]): Promise<any> {
    try {
      const result = await this.getInstance().query(statement, params);
      const [rows, meta] = result;
      return Promise.resolve(rows[0]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static none(statement: string, params: any[]): Promise<any> {
    return Promise.reject(new Error("Not implemented yet"));
  }
}
