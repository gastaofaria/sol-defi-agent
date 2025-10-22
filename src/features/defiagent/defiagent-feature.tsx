import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { DefiagentUiButtonInitialize } from './ui/defiagent-ui-button-initialize'
import { DefiagentUiList } from './ui/defiagent-ui-list'
import { DefiagentUiProgramExplorerLink } from './ui/defiagent-ui-program-explorer-link'
import { DefiagentUiProgramGuard } from './ui/defiagent-ui-program-guard'

export default function DefiagentFeature() {
  const { account } = useSolana()

  return (
    <DefiagentUiProgramGuard>
      <AppHero
        title="Defiagent"
        subtitle={
          account
            ? "Initialize a new defiagent onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <DefiagentUiProgramExplorerLink />
        </p>
        {account ? (
          <DefiagentUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <DefiagentUiList account={account} /> : null}
    </DefiagentUiProgramGuard>
  )
}
