import { Command, UserCommand } from './types.js';

export class InMemoryDatabase {
  private keyValueMap: {[key: string]: string};
  private valueCountMap: {[key: string]: number};

  constructor() {
    this.keyValueMap = {}
    this.valueCountMap = {}
  }

  setKeyValue(key, value) {
    this.keyValueMap[key] = value;
    if (this.valueCountMap[value] === undefined) {
      this.valueCountMap[value] = 1
    } else {
      this.valueCountMap[value] += 1
    }
  }

  getValue(key) {
    const value = this.keyValueMap[key];
    return value === undefined ? null : value
  }

  count(value) {
    return this.valueCountMap[value] === undefined ? 0 : this.valueCountMap[value]
  }

  delete(key) {
    const originalValue = this.keyValueMap[key];
    if (originalValue) {
      this.valueCountMap[originalValue] -= 1
    }
    this.keyValueMap[key] = undefined;
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
}
