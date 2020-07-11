const bchAddr = "bitcoincash:qq8mk8etntclfdkny2aknh4ylc0uaewalszh5eytnr"

const MemoGet = require("../src")
const memoGet = new MemoGet()

async function read() {
  try {
    const msg = await memoGet.read(bchAddr)
    console.log(msg)
  } catch (err) {
    console.error(err)
  }
}
read()
