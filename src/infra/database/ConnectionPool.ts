export default interface ConnectionPool {
  instance: any;
  query(statement: string, params: any[]): Promise<any>;
  one(statement: string, params: any[]): Promise<any>;
  oneOrNone(statement: string, params: any[]): Promise<any>;
  none(statement: string, params: any[]): Promise<any>;
}
