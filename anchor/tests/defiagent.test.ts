import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchDefiagent,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('defiagent', () => {
  let payer: KeyPairSigner
  let defiagent: KeyPairSigner

  beforeAll(async () => {
    defiagent = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Defiagent', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, defiagent: defiagent })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentDefiagent = await fetchDefiagent(rpc, defiagent.address)
    expect(currentDefiagent.data.count).toEqual(0)
  })

  it('Increment Defiagent', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      defiagent: defiagent.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchDefiagent(rpc, defiagent.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Defiagent Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ defiagent: defiagent.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchDefiagent(rpc, defiagent.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Defiagent', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      defiagent: defiagent.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchDefiagent(rpc, defiagent.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set defiagent value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ defiagent: defiagent.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchDefiagent(rpc, defiagent.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the defiagent account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      defiagent: defiagent.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchDefiagent(rpc, defiagent.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${defiagent.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
