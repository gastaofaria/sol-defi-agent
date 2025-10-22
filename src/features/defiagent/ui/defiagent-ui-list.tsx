import { DefiagentUiCard } from './defiagent-ui-card'
import { useDefiagentAccountsQuery } from '@/features/defiagent/data-access/use-defiagent-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function DefiagentUiList({ account }: { account: UiWalletAccount }) {
  const defiagentAccountsQuery = useDefiagentAccountsQuery()

  if (defiagentAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!defiagentAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {defiagentAccountsQuery.data?.map((defiagent) => (
        <DefiagentUiCard account={account} key={defiagent.address} defiagent={defiagent} />
      ))}
    </div>
  )
}
