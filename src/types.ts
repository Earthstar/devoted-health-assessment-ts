export enum Command {
  SET,
  GET,
  DELETE,
  COUNT,
  END,
  BEGIN,
  ROLLBACK,
  COMMIT
}

export interface UserCommand {
  command: Command,
  arg1?: string,
  arg2?: string
}
