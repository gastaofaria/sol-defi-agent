import { DefiagentAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { DefiagentUiButtonClose } from './defiagent-ui-button-close'
import { DefiagentUiButtonDecrement } from './defiagent-ui-button-decrement'
import { DefiagentUiButtonIncrement } from './defiagent-ui-button-increment'
import { DefiagentUiButtonSet } from './defiagent-ui-button-set'

export function DefiagentUiCard({ account, defiagent }: { account: UiWalletAccount; defiagent: DefiagentAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Defiagent: {defiagent.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={defiagent.address} label={ellipsify(defiagent.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <DefiagentUiButtonIncrement account={account} defiagent={defiagent} />
          <DefiagentUiButtonSet account={account} defiagent={defiagent} />
          <DefiagentUiButtonDecrement account={account} defiagent={defiagent} />
          <DefiagentUiButtonClose account={account} defiagent={defiagent} />
        </div>
      </CardContent>
    </Card>
  )
}
