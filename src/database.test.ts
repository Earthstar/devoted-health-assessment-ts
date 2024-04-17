import { InMemoryDatabase } from './database.js';
import { Command } from './types.js';

describe('InMemoryDatabase', () => {
  it('Can save and retrieve a key and value', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    expect(inMemoryDb.getValue('foo')).toEqual('bar');
  });

  it('getValue returns null if value is not in DB', () => {
    const inMemoryDb = new InMemoryDatabase();
    expect(inMemoryDb.getValue('foo')).toBeNull();
  });

  it('returns the count of a single value', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    expect(inMemoryDb.count('bar')).toEqual(1);
  });

  it('returns the count of multiple values', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    inMemoryDb.setKeyValue('baz', 'bar');
    expect(inMemoryDb.count('bar')).toEqual(2);
  });

  it('returns 0 if there is no value', () => {
    const inMemoryDb = new InMemoryDatabase();
    expect(inMemoryDb.count('bar')).toEqual(0);
  });

  it('when a value is deleted, it is no longer get-able', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    inMemoryDb.delete('foo');
    expect(inMemoryDb.getValue('foo')).toBeNull();
  });

  it('when a value is deleted, it is no longer count-able', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    inMemoryDb.delete('foo');
    expect(inMemoryDb.count('bar')).toEqual(0);
  });

  it('if there are multiple of the same value, delete decrements by one', () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.setKeyValue('foo', 'bar');
    inMemoryDb.setKeyValue('baz', 'bar');
    inMemoryDb.delete('foo');
    expect(inMemoryDb.count('bar')).toEqual(1);
  });

  it("can apply commands", () => {
    const inMemoryDb = new InMemoryDatabase();
    inMemoryDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    expect(inMemoryDb.apply({
      command: Command.GET,
      arg1: "foo",
    })).toEqual("bar")
    expect(inMemoryDb.apply({
      command: Command.COUNT,
      arg1: "bar",
    })).toEqual(1)
    inMemoryDb.apply({
      command: Command.DELETE,
      arg1: "foo",
    })
    expect(inMemoryDb.apply({
      command: Command.GET,
      arg1: "foo",
    })).toBeNull()
    expect(inMemoryDb.apply({
      command: Command.COUNT,
      arg1: "bar",
    })).toEqual(0)
  })
});

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
