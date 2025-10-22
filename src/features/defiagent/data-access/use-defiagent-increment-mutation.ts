import { DefiagentAccount, getIncrementInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useDefiagentAccountsInvalidate } from './use-defiagent-accounts-invalidate'

export function useDefiagentIncrementMutation({
  account,
  defiagent,
}: {
  account: UiWalletAccount
  defiagent: DefiagentAccount
}) {
  const invalidateAccounts = useDefiagentAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ defiagent: defiagent.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
