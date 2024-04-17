import { InMemoryDatabase } from './inMemoryDatabase.js';

describe("Transactional Database", () => {
  it("can add keys in a transaction", () => {
    const inMemoryDb = new InMemoryDatabase()
    inMemoryDb.beginTransaction()
    inMemoryDb.setKeyValue("foo", "bar")
    expect(inMemoryDb.count("bar")).toEqual(1)
    inMemoryDb.commitTransaction()
    expect(inMemoryDb.count("bar")).toEqual(1)
  })

  it("Rollback, if there are no transactions, throws an error", () => {
    const inMemoryDb = new InMemoryDatabase()
    expect(() => inMemoryDb.rollbackTransaction()).toThrow()
  })

  it("Can rollback a SET operation", () => {
    const inMemoryDb = new InMemoryDatabase()
    inMemoryDb.beginTransaction()
    inMemoryDb.setKeyValue("foo", "bar")
    inMemoryDb.beginTransaction()
    inMemoryDb.setKeyValue("foo", "baz")
    inMemoryDb.rollbackTransaction()
    expect(inMemoryDb.count("bar")).toEqual("bar")
  })
})
