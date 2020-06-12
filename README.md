memo-get
=========

A simple command-line tool for reading messages from the blockchain. It will scan the transaction history for a Bitcoin Cash (BCH) address and looking for messages published with the [Memo.cash protocol](https://memo.cash/protocol).

<!-- toc -->
# Installation
- Install the npm package globally, in order to use it as a command line tool:

`sudo npm install -g memo-get`

# Usage
<!-- usage -->
- `memo-get -h` - display help menu
- `memo-get -v` - display version
- `memo-get -a <cash address>` - Scan transaction for 'IPFS UPDATE' messages.
