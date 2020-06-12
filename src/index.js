const { Command, flags } = require("@oclif/command")

const BCHJS = require("@chris.troutner/bch-js")
const bchjs = new BCHJS()

let _this

class MemoGetCommand extends Command {
  constructor(argv, config) {
    super(argv, config)

    _this = this

    this.bchjs = bchjs
  }

  async run() {
    const { flags } = this.parse(MemoGetCommand)

    try {
      const addr = flags.address

      if (!addr || addr === "") throw new Error(`Please specify a BCH address.`)

      // Prefact text to put in front of the message.
      const preface = "IPFS UPDATE"

      const str = await this.read(addr, preface)

      if (!str) {
        console.log(
          `Could not find any messages that match the preface ${preface}.`
        )
        return
      }

      console.log(`Message found: ${str}`)

      //this.log(`hello ${name} from ./src/index.js`)
    } catch (err) {
      console.error(err)
    }
  }

  // Read the transaction history of the address. Looks for an OP_RETURN message
  // with a matching preface.
  async read(addr, preface) {
    try {
      const txHist = await this.bchjs.Electrumx.transactions(addr)
      // console.log(`txHist: ${JSON.stringify(txHist, null, 2)}`)

      if (!txHist.success)
        throw new Error(`No transaction history could be found for ${addr}`)

      // Sort the transactions so that newest is first.
      const txs = _this.sortTxsByHeight(txHist.transactions, "DESCENDING")

      // Loop through each transaction associated with this address.
      for (let i = 0; i < txs.length; i++) {
        const thisTXID = txs[i].tx_hash
        // console.log(`Inspecting TXID ${thisTXID}`)

        const thisTx = await _this.bchjs.RawTransactions.getRawTransaction(
          thisTXID,
          true
        )
        //console.log(`thisTx: ${JSON.stringify(thisTx, null, 2)}`)

        // Loop through all the vout entries in this transaction.
        for (let j = 0; j < thisTx.vout.length; j++) {
          //for (let j = 0; j < 5; j++) {
          const thisVout = thisTx.vout[j]
          //console.log(`thisVout: ${JSON.stringify(thisVout,null,2)}`)

          // Assembly code representation of the transaction.
          const asm = thisVout.scriptPubKey.asm
          //console.log(`asm: ${asm}`)

          // Decode the transactions assembly code.
          const msg = this.decodeTransaction2(asm)
          //console.log(`msg: ${msg}`)

          if (msg) {
            // Filter the code to see if it contains an IPFS hash.
            const hash = this.filterHash(msg, preface)
            if (hash) {
              // console.log(`Hash found! ${hash}`)
              return hash
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error in memo-get/read()`)
      throw err
    }
  }

  // The original decodeTransaction() did not work on the front end. This function
  // is a hack around the issue.
  decodeTransaction2(asm) {
    try {
      const asmWords = asm.split(" ")
      //console.log(`asmWords: ${JSON.stringify(asmWords,null,2)}`)

      if (asmWords[0] === "OP_RETURN" && asmWords[1] === "621") {
        const msg = Buffer.from(asmWords[2], "hex").toString()
        // console.log(`msg: ${msg}`)

        return msg
      }

      return false
    } catch (err) {
      console.warn(`Error in decodeTransaction2: `, err)
      return false
    }
  }

  // Filters a string to see if it matches the proper pattern of:
  // 'IPFS UPDATE <hash>'
  // Returns the hash if the pattern matches. Otherwise, returns false.
  filterHash(msg, preface) {
    try {
      if (msg.indexOf(preface) > -1) {
        // console.log(`match found`)

        // Split the message between the preface and the payload.
        const parts = msg.split(`${preface} `)

        const payload = parts[1]
        return payload
      }
    } catch (err) {
      // Exit silently
      return false
    }
  }

  // Sort the Transactions by the block height
  sortTxsByHeight(txs, sortingOrder = "ASCENDING") {
    if (sortingOrder === "ASCENDING")
      return txs.sort((a, b) => a.height - b.height)
    return txs.sort((a, b) => b.height - a.height)
  }
}

MemoGetCommand.description = `Read OP_RETURN messages from the BCH Blockchain
Crawls the transaction history of a Bitcoin Cash address, looking for transactions
with an OP_RETURN message following the memo.cash protocol, which matches the
prefix.
`

MemoGetCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: "v" }),
  // add --help flag to show CLI version
  help: flags.help({ char: "h" }),
  address: flags.string({
    char: "a",
    description: "Bitcoin Cash address to check"
  })
}

module.exports = MemoGetCommand
