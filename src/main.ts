import { formatResponse, parseCommand } from './parser.js';
import * as readline from 'node:readline';
import { Command } from './types.js';
import { TransactionalDatabase } from './transactionalDatabase.js';

const transactionalDb = new TransactionalDatabase();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.setPrompt('>> ');
rl.prompt();

rl.on('line', (line) => {
  try {
    const command = parseCommand(line);
    if (command.command === Command.END) {
      rl.close();
      return;
    }
    const result = transactionalDb.apply(command);
    const formattedResponse = formatResponse(result);
    if (formattedResponse !== undefined) {
      console.log(formattedResponse);
    }
  } catch (e) {
    console.log(e.message);
  }
  rl.prompt();
});
