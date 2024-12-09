import { DefaultSeo } from 'next-seo';
import { ToastContainer } from 'react-toastify';
import SEO from '~/next-seo.config';
import { Wrapper } from '~/components';
import { electroliceFont, bebasFont, racesportFont } from '~/public/fonts';
import WagmiProviderComp from '~/lib/wagmiProvider';
import '~/styles/index.css';
import '~/styles/main.scss';
import 'swiper/css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'TraitForge | Mint, Nuke, and Forge Unique Entities',
  description: 'Unleash your creativity with TraitForge. Mint, Nuke, and Forge unique NFTs with distinct traits and endless possibilities.',
  openGraph: {
    title: 'TraitForge: Mint, Nuke, and Forge Unique Entities',
    description: 'Dive into TraitForge, where creativity meets strategy. Mint up to 100,000 distinct NFTs with unique traits. Play, forge, and build your collection!',
    url: 'https://traitforge.game',
    images: [
      {
        url: 'https://traitforge.game/public/images/websitelogo.png',
        height: 630,
        alt: 'TraitForge Preview Image',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          className={`${electroliceFont.variable} ${bebasFont.variable} ${racesportFont.variable} font-sans`}
        >
          <WagmiProviderComp>
            <Wrapper>
              {children}
              <ToastContainer
                position="bottom-right"
                theme="dark"
                autoClose={3000}
                closeOnClick
                className="custom-toast-container"
                closeButton={false}
                style={{ fontSize: '20px' }}
                limit={3}
              />
            </Wrapper>
          </WagmiProviderComp>
          <div id="modal-root"></div>
        </div>
      </body>
    </html>
  );
}
