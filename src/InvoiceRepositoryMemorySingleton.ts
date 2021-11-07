import InvoiceRepository from "./InvoiceRepository";
import InvoiceRepositoryMemory from "./InvoiceRepositoryMemory";

export default class InvoiceRepositoryMemorySingleton {
  static instance: InvoiceRepository | undefined;

  private constructor() {}

  static getInstance(): InvoiceRepository {
    if (!InvoiceRepositoryMemorySingleton.instance) {
      InvoiceRepositoryMemorySingleton.instance = new InvoiceRepositoryMemory();
    }
    return InvoiceRepositoryMemorySingleton.instance;
  }

  static destroy() {
    InvoiceRepositoryMemorySingleton.instance = undefined;
  }
}
