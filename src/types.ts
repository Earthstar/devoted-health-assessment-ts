export enum Command {
  SET,
  GET,
  DELETE,
  COUNT,
  END,
  BEGIN,
  ROLLBACK,
  COMMIT,
}

export interface UserCommand {
  command: Command;
  arg1?: string;
  arg2?: string;
}

export interface DatabaseStorage {
  keyValueMap: { [key: string]: string };
  valueCountMap: { [key: string]: number };
}

export interface TransactionRecords {
  uncommittedDb: DatabaseStorage;
  transactions: UserCommand[][];
}
