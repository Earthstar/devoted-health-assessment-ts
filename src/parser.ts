import { Command, UserCommand } from './types.js';

export function testPrint(text) {
  console.log(text)
}

// Throws an exception if the command can't be parsed
export function parseCommand(text: string): UserCommand {
  const splitString = text.split(" ");
  switch (splitString[0]) {
    case "SET":
      if (splitString[1] === undefined || splitString[2] === undefined) {
        throw new Error("SET requires two arguments")
      }
      return {
        command: Command.SET,
        arg1: splitString[1],
        arg2: splitString[2]
      }
    case "GET":
      if (splitString[1] === undefined) {
        throw new Error("GET requires one argument")
      }
      return {
        command: Command.GET,
        arg1: splitString[1],
      }
    case "DELETE":
      if (splitString[1] === undefined) {
        throw new Error("DELETE requires one argument")
      }
      return {
        command: Command.DELETE,
        arg1: splitString[1],
      }
    case "COUNT":
      if (splitString[1] === undefined) {
        throw new Error("COUNT requires one argument")
      }
      return {
        command: Command.COUNT,
        arg1: splitString[1],
      }
    case "END":
      return {
        command: Command.END,
      }
    case "BEGIN":
      return {
        command: Command.BEGIN,
      }
    case "ROLLBACK":
      return {
        command: Command.ROLLBACK,
      }
    case "COMMIT":
      return {
        command: Command.COMMIT,
      }
    default:
      throw new Error(`Did not recognize command ${text}`)
  }
}
