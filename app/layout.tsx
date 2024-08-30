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
