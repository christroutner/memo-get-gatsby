/*
  Integration tests
*/

const assert = require("chai").assert

const MemoGet = require("../../src/index")
let uut

describe("#MemoGet", () => {
  beforeEach(() => {
    uut = new MemoGet()
  })

  describe("#read", () => {
    it("should read the latest message from a BCH address", async () => {
      const addr = `bitcoincash:qr7u857krgsvq0dwe8rzlt5rcx35r6hnmu6glavtx0`

      const msg = await uut.read(addr)
      // console.log(`msg: ${msg}`)

      assert.include(msg, "Qm")
    })

    it("should return undefined if message can not be found", async () => {
      const addr = `bitcoincash:qr7u857krgsvq0dwe8rzlt5rcx35r6hnmu6glavtx0`

      const msg = await uut.read(addr, "test")
      console.log(`msg: ${msg}`)
    })
  })
})
