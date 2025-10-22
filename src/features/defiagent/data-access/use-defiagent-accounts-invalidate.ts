import { useQueryClient } from '@tanstack/react-query'
import { useDefiagentAccountsQueryKey } from './use-defiagent-accounts-query-key'

export function useDefiagentAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useDefiagentAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
