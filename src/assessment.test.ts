import { TransactionalDatabase } from './transactionalDatabase.js';
import { Command } from './types.js';

describe("Assessment tests", () => {
  it("Example #1", () => {
    const transactionalDb = new TransactionalDatabase();
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: 'a',
    })).toBeNull();
    transactionalDb.apply({
      command: Command.SET,
      arg1: 'a',
      arg2: 'foo',
    });
    transactionalDb.apply({
      command: Command.SET,
      arg1: 'b',
      arg2: 'foo',
    });
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'foo',
    })).toEqual(2);
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'bar',
    })).toEqual(0);
    transactionalDb.apply({
      command: Command.DELETE,
      arg1: 'a',
    })
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'foo',
    })).toEqual(1);
    transactionalDb.apply({
      command: Command.SET,
      arg1: 'b',
      arg2: 'baz',
    });
    expect(transactionalDb.apply({
      command: Command.COUNT,
      arg1: 'foo',
    })).toEqual(0);
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: 'b',
    })).toEqual("baz");
    expect(transactionalDb.apply({
      command: Command.GET,
      arg1: 'B',
    })).toBeNull();
  })
})
