import { createPublicClient, http } from 'viem';
import { sepolia, baseSepolia } from 'viem/chains';

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPCURL),
});

export const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPCURL),
});
