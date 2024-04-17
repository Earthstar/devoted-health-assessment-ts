import { Command, DatabaseStorage, TransactionRecords, UserCommand } from './types.js';

export class InMemoryDatabase {
  private committed: DatabaseStorage;
  // @ts-ignore
  private transactionRecords: TransactionRecords
  constructor() {
    this.committed = {
      keyValueMap: {},
      valueCountMap: {}
    }
  }

  setKeyValue(key, value) {
    this.committed.keyValueMap[key] = value;
    if (this.committed.valueCountMap[value] === undefined) {
      this.committed.valueCountMap[value] = 1
    } else {
      this.committed.valueCountMap[value] += 1
    }
  }

  getValue(key) {
    const value = this.committed.keyValueMap[key];
    return value === undefined ? null : value
  }

  count(value) {
    return this.committed.valueCountMap[value] === undefined ? 0 : this.committed.valueCountMap[value]
  }

  delete(key) {
    const originalValue = this.committed.keyValueMap[key];
    if (originalValue) {
      this.committed.valueCountMap[originalValue] -= 1
    }
    this.committed.keyValueMap[key] = undefined;
  }

  apply({command, arg1, arg2} : UserCommand) : void | string | number {
    switch (command) {
      case Command.SET:
        return this.setKeyValue(arg1, arg2)
      case Command.GET:
        return this.getValue(arg1)
      case Command.COUNT:
        return this.count(arg1)
      case Command.DELETE:
        return this.delete(arg1)
      default:
        throw new Error(`Unhandled command ${command}`)
    }
  }

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
