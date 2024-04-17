import { parseCommand } from './parser.js';

console.log("hello world")
import * as readline from 'node:readline';
import { Command } from './types.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', line => {
  try {
    const command = parseCommand(line)
    if (command.command === Command.END) {
      rl.close()
      return
    }
  } catch (e) {
    console.log(e)
  }

})
