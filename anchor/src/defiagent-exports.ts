// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Defiagent, DEFIAGENT_DISCRIMINATOR, DEFIAGENT_PROGRAM_ADDRESS, getDefiagentDecoder } from './client/js'
import DefiagentIDL from '../target/idl/defiagent.json'

export type DefiagentAccount = Account<Defiagent, string>

// Re-export the generated IDL and type
export { DefiagentIDL }

export * from './client/js'

export function getDefiagentProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getDefiagentDecoder(),
    filter: getBase58Decoder().decode(DEFIAGENT_DISCRIMINATOR),
    programAddress: DEFIAGENT_PROGRAM_ADDRESS,
  })
}
