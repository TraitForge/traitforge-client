import Logo from '@/public/images/transparentlogo.png';
import Web3Modal from '@web3modal/ethers/react';

'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = 'ce6b3d38d61ac9bfbea71e7dda0ba323'

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
  name: 'TraitForge',
  description: 'A HoneyPot Game',
  url: 'http://www.traitforge.game/', 
  icons: [Logo]
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true, 
  enableInjected: true, 
  enableCoinbase: true, 
  rpcUrl: '...', 
  defaultChainId: 1, 
})

const web3Modal = new Web3Modal ({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true, 
    enableOnramp: true 
  })

export function Web3ModalProvider({ children }) {
  return children
}