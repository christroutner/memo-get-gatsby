memo-get-gatsby
===============

A library for reading messages from the blockchain. It will scan the transaction history for a Bitcoin Cash (BCH) address and looking for messages published with the [Memo.cash protocol](https://memo.cash/protocol).

<!-- toc -->
# Installation
- Install the npm package globally, in order to use it as a command line tool:

`sudo npm install -g memo-get-gatsby`

# Usage
```
const MemoGet = import "memo-get-gatsby"
memoGet = new MemoGet()

const addr = `bitcoincash:qr7u857krgsvq0dwe8rzlt5rcx35r6hnmu6glavtx0`
const msg = await memoGet.read(addr)
```
