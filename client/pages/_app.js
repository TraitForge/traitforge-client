import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';
import { Wrapper } from '@/components';
import { ContextProvider } from '@/utils/context';
import "../styles/index.css"
import "swiper/css";

import Logo from '@/public/images/websitelogo.png';
import '@/styles/main.scss';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = 'YOUR_PROJECT_ID'

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
  name: 'TraitForge',
  description: 'NFT HoneyPot Game',
  url: 'https://mywebsite.com',
  icons: [Logo]
}

const ethersConfig = defaultConfig({
  metadata,

  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  defaultChainId: 1,
})

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true
})

const App = ({ Component, pageProps }) => (
  <ContextProvider>
    <Wrapper>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Wrapper>
  </ContextProvider>
);

export default App;
