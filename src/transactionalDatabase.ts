import { TransactionRecords } from './types.js';

export class TransactionalDatabase {
  // @ts-ignore
  private transactionRecords: TransactionRecords

  beginTransaction() {
    this.transactionRecords = {
      uncommittedDb: structuredClone(this.committed),
      transactions: [[]]
    }
  }

  rollbackTransaction() {
    if (!this.inTransaction()) {
      throw new Error("TRANSACTION NOT FOUND")
    }



  }

  commitTransaction() {

  }

  inTransaction() {
    return !!this.transactionRecords
  }
}
