import { parseCommand } from './parser.js';
import { Command } from './types.js';

describe("parse", () => {
  it("can parse a SET command with two args", () => {
    const command = "SET foo bar"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.SET)
    expect(result.arg1).toEqual("foo")
    expect(result.arg2).toEqual("bar")
  })

  it("throws an error if both args are missing", () => {
    const command = "SET"
    expect(() => parseCommand(command)).toThrow()
  })

  it("throws an error if one arg is missing", () => {
    const command = "SET foo"
    expect(() => parseCommand(command)).toThrow()
  })

  it("Can parse a GET command with one arg", () => {
    const command = "GET foo"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.GET)
    expect(result.arg1).toEqual("foo")
  })

  it("throws an error if GET has no args", () => {
    const command = "GET"
    expect(() => parseCommand(command)).toThrow()
  })

  it("Can parse DELETE with one argument", () => {
    const command = "DELETE foo"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.DELETE)
    expect(result.arg1).toEqual("foo")
  })

  it("throws an error if DELETE has no args", () => {
    const command = "DELETE"
    expect(() => parseCommand(command)).toThrow()
  })

  it("Can parse COUNT with one argument", () => {
    const command = "COUNT foo"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.COUNT)
    expect(result.arg1).toEqual("foo")
  })

  it("throws an error if COUNT has no args", () => {
    const command = "COUNT"
    expect(() => parseCommand(command)).toThrow()
  })

  it("Can parse END", () => {
    const command = "END"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.END)
  })

  it("Can parse BEGIN", () => {
    const command = "BEGIN"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.BEGIN)
  })

  it("Can parse ROLLBACK", () => {
    const command = "ROLLBACK"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.ROLLBACK)
  })

  it("Can parse COMMIT", () => {
    const command = "COMMIT"
    const result = parseCommand(command)
    expect(result.command).toEqual(Command.COMMIT)
  })

  it("throws an error if the command is not recognized", () => {
    const command = "asdf"
    expect(() => parseCommand(command)).toThrow()
  })
})
