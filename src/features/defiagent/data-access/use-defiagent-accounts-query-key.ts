import { useSolana } from '@/components/solana/use-solana'

export function useDefiagentAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['defiagent', 'accounts', { cluster }]
}
