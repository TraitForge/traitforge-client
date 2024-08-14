import { createConfig, http } from 'wagmi';
import { sepolia } from 'viem/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const { connectors } = getDefaultWallets({
  appName: 'traitforge',
  projectId,
});

export const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPCURL),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
