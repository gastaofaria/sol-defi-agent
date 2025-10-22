import { DefiagentAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useDefiagentDecrementMutation } from '../data-access/use-defiagent-decrement-mutation'

export function DefiagentUiButtonDecrement({ account, defiagent }: { account: UiWalletAccount; defiagent: DefiagentAccount }) {
  const decrementMutation = useDefiagentDecrementMutation({ account, defiagent })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
