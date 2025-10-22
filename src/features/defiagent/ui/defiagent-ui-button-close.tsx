import { DefiagentAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useDefiagentCloseMutation } from '@/features/defiagent/data-access/use-defiagent-close-mutation'

export function DefiagentUiButtonClose({ account, defiagent }: { account: UiWalletAccount; defiagent: DefiagentAccount }) {
  const closeMutation = useDefiagentCloseMutation({ account, defiagent })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
