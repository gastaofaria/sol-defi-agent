import { DefiagentAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useDefiagentSetMutation } from '@/features/defiagent/data-access/use-defiagent-set-mutation'

export function DefiagentUiButtonSet({ account, defiagent }: { account: UiWalletAccount; defiagent: DefiagentAccount }) {
  const setMutation = useDefiagentSetMutation({ account, defiagent })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', defiagent.data.count.toString() ?? '0')
        if (!value || parseInt(value) === defiagent.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
