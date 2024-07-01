import { createPublicClient } from 'viem';
import { http, createConfig } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { sepolia } from 'viem/chains';

export const projectId = 'db99d4d311764dbfb7e4563ce13e71fb';

if (!projectId) throw new Error('Project ID is not defined');

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPCURL),
  },
  ssr: true,
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPCURL),
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
