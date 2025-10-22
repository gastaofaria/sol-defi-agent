import { DefiagentAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useDefiagentAccountsInvalidate } from './use-defiagent-accounts-invalidate'

export function useDefiagentDecrementMutation({
  account,
  defiagent,
}: {
  account: UiWalletAccount
  defiagent: DefiagentAccount
}) {
  const invalidateAccounts = useDefiagentAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ defiagent: defiagent.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
