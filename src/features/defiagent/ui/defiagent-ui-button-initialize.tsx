import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useDefiagentInitializeMutation } from '@/features/defiagent/data-access/use-defiagent-initialize-mutation'

export function DefiagentUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useDefiagentInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Defiagent {mutationInitialize.isPending && '...'}
    </Button>
  )
}
