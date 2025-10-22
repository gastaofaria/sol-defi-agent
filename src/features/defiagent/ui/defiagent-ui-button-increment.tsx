import { DefiagentAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useDefiagentIncrementMutation } from '../data-access/use-defiagent-increment-mutation'

export function DefiagentUiButtonIncrement({ account, defiagent }: { account: UiWalletAccount; defiagent: DefiagentAccount }) {
  const incrementMutation = useDefiagentIncrementMutation({ account, defiagent })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
