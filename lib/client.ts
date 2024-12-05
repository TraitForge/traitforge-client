import { createPublicClient, http } from 'viem';
import { sepolia, base } from 'viem/chains';

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPCURL),
});

export const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPCURL),
});
