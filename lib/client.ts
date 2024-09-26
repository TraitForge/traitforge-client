import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPCURL),
});
