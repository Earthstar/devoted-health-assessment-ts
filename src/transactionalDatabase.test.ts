import { TransactionalDatabase } from './transactionalDatabase.js';
import { Command } from './types.js';

describe('Transactional Database', () => {
  it('can apply commands with no transactions', () => {
    const transactionalDb = new TransactionalDatabase();
    transactionalDb.apply({
      command: Command.SET,
      arg1: 'foo',
      arg2: 'bar',
    });
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: 'foo',
    })).toEqual('bar');
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'bar',
    })).toEqual(1);
    transactionalDb.apply({
      command: Command.DELETE,
      arg1: 'foo',
    });
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: 'foo',
    })).toBeNull();
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'bar',
    })).toEqual(0);
  });

  it("can set and get keys in a transaction", () => {
    const transactionalDb = new TransactionalDatabase()
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.COMMIT
    })
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: "foo"
    })).toEqual("bar")
    transactionalDb.commitTransaction()
  })

  it("Rollback, if there are no transactions, throws an error", () => {
    const transactionalDb = new TransactionalDatabase()
    expect(() => transactionalDb.rollbackTransaction()).toThrow()
  })

  it("Can rollback a SET operation", () => {
    const transactionalDb = new TransactionalDatabase()
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "baz"
    })
    transactionalDb.apply({
      command: Command.ROLLBACK
    })
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: "foo"
    })).toEqual("bar")
  })

  it("Can rollback a database to empty state", () => {
    const transactionalDb = new TransactionalDatabase()
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.ROLLBACK
    })
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: "foo"
    })).toBeNull()
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: "bar"
    })).toEqual(0)
  })

  it("rollback will remove count", () => {
    const transactionalDb = new TransactionalDatabase()
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "biz",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.ROLLBACK
    })
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: "bar"
    })).toEqual(1)
  })

  it("Rollback throws an error if attempting to rollback further than there are transactions", () => {
    const transactionalDb = new TransactionalDatabase()
    transactionalDb.apply({
      command: Command.BEGIN
    })
    transactionalDb.apply({
      command: Command.SET,
      arg1: "foo",
      arg2: "bar"
    })
    transactionalDb.apply({
      command: Command.ROLLBACK,
    })
    expect(() => transactionalDb.apply({
      command: Command.ROLLBACK,
    })).toThrow();
  })
})
