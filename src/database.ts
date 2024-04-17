import { DatabaseStorage } from './types.js';

export class InMemoryDatabase {
  private committed: DatabaseStorage;
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
}
