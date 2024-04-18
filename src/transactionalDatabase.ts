import { InMemoryDatabase } from './inMemoryDatabase.js';
import { Command, UserCommand } from './types.js';

export class TransactionalDatabase {
  private transactionRecords
  private committed: InMemoryDatabase

  constructor() {
    this.committed = new InMemoryDatabase();
  }

  apply(userCommand: UserCommand) : void | string | number {
    switch (userCommand.command) {
      case (Command.BEGIN):
        return this.beginTransaction()
      case (Command.ROLLBACK):
        return this.rollbackTransaction()
      case (Command.COMMIT):
        return this.commitTransaction()
    }
    if (!this.inTransaction()) {
      return this.committed.apply(userCommand);
    } else {
      this.addCommandToLastTransaction(userCommand)
      return this.transactionRecords.uncommittedDb.apply(userCommand)
    }
  }

  beginTransaction() {
    if (!this.inTransaction()) {
      this.transactionRecords = {
        uncommittedDb: this.committed.deepCopy(),
        transactions: [[]]
      }
    } else {
      this.transactionRecords.transactions.push([])
    }
  }

  rollbackTransaction() {
    if (!this.inTransaction()) {
      throw new Error("TRANSACTION NOT FOUND")
    }

    const lastTransaction = this.getLastTransaction()
    if (!lastTransaction) {
      throw new Error("TRANSACTION NOT FOUND")
    }
    this.removeLastTransaction()

    delete this.transactionRecords.uncommittedDb
    const rolledBackDb = this.committed.deepCopy()
    for (const transaction of this.transactionRecords.transactions) {
      for (const command of transaction) {
        rolledBackDb.apply(command)
      }
    }
    this.transactionRecords.uncommittedDb = rolledBackDb;
  }

  commitTransaction() {
    if (this.inTransaction()) {
      delete this.committed
      this.committed = this.transactionRecords.uncommittedDb
      delete this.transactionRecords
    }
  }

  private inTransaction() {
    return !!this.transactionRecords
  }

  private getLastTransaction() {
    return this.transactionRecords.transactions.at(-1)
  }

  private removeLastTransaction() {
    if (this.transactionRecords.transactions.length === 1) {
      this.transactionRecords.transactions = []
    }
    this.transactionRecords.transactions.pop()
  }

  private addCommandToLastTransaction(userCommand: UserCommand) {
    if (this.transactionRecords.transactions.length === 0) {
      this.transactionRecords.transactions = [[userCommand]]
    } else {
      this.getLastTransaction().push(userCommand)
    }
  }
}
