# Setup
Install nvm according to: https://nodejs.org/en/download/package-manager
```bash
nvm use
npm install
npm run build
npm run start
```
Assessment examples are defined in `/src/assessment.test.ts` and can be run with
```bash 
npm run test
```

# Code walkthrough
- `src/main.ts` - entrypoint of project, instantiates DB, reads user input, and generates output
- `src/parser.ts` - contains logic to parse inputs and format outputs
- `src/transactionalDatabase.ts` - Contains implementation of in-memory database with transactions. Uses InMemoryDatabase to handle internal state.
- `src/inMemoryDatabase.ts` - contains implementation of a simple in-memory database with no transactions

# Time and Memory analysis
Given `k` as the size of the key-value pairs, `n` as the number of entries, and `t` as the total number of commands in a transaction.
- SET - O(1) time, + `2k` memory (+ O(1) memory in a transaction)
- GET - O(1) time
- DELETE - O(1) time, - `2k` memory (+ O(1) memory in a transaction)
- COUNT - O(1) time
- END - N/A, ends program
- BEGIN - O(1) time, + O(`2k*n`) additional memory for the first transaction; + `2k` memory for subsequent transactions
- ROLLBACK - O(`t`) time, Memory usage <= previous size of db
- COMMIT - O(1) time, - O(`2k*n`) memory 

When setting key-value pairs, the DB internally stores them as an entry in a key-value map, plus a value-count map. This allows GET and COUNT to be fast, O(1) time by getting the value from the corresponding map. DELETE removes entries from both the key-value map and the value-count map. 

When we begin a new transaction, the DB makes a copy of the existing "committed" data as `uncommittedDb`. Operations in the transaction are applied to `uncommittedDb` and added to a transaction list. When a transaction is rolled back, we delete the last transaction in the transaction list, delete `uncommittedDb`, then copy the committed DB and apply the remaining transactions to make a new `uncommittedDb`. Starting a transaction requires `2kn` additional memory to copy the db (`2*2kn` total). Subsequent commands in the transactions require only `2k` additional memory. 

# Known issues
- When setting keys to different values, we don't delete internal count storage (memory leak)
- Commands are case-sensitive