import { DefaultSeo } from 'next-seo';
import { type AppType } from 'next/app';
import { ToastContainer } from 'react-toastify';
import SEO from '~/next-seo.config';
import { Wrapper } from '~/components';
import { electroliceFont, bebasFont } from '~/public/fonts';
import WagmiProviderComp from '~/lib/wagmiProvider';
import '~/styles/index.css';
import '~/styles/main.scss';
import 'swiper/css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const App: AppType = ({ Component, pageProps }) => {
  return (
    <div
      className={`${electroliceFont.variable} ${bebasFont.variable} font-sans`}
    >
      <WagmiProviderComp>
        <Wrapper>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
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
  );
};

export default App;
