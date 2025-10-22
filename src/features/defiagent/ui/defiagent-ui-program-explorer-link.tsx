import { DEFIAGENT_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function DefiagentUiProgramExplorerLink() {
  return <AppExplorerLink address={DEFIAGENT_PROGRAM_ADDRESS} label={ellipsify(DEFIAGENT_PROGRAM_ADDRESS)} />
}
