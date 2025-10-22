import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getDefiagentProgramAccounts } from '@project/anchor'
import { useDefiagentAccountsQueryKey } from './use-defiagent-accounts-query-key'

export function useDefiagentAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useDefiagentAccountsQueryKey(),
    queryFn: async () => await getDefiagentProgramAccounts(client.rpc),
  })
}
