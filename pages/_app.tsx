import { DefaultSeo } from 'next-seo';
import { type AppType } from 'next/app';
import { headers } from 'next/headers';
import { ToastContainer } from 'react-toastify';
import SEO from '~/next-seo.config';
import { Wrapper } from '~/components';
import { electroliceFont, bebasFont } from '~/public/fonts';
import { config } from '~/lib/config';
import WagmiProviderComp from '~/lib/wagmiProvider';
import 'swiper/css';
import 'react-toastify/dist/ReactToastify.css';
import '~/styles/index.css';
import '`/styles/main.scss';
import { cookieToInitialState } from 'wagmi';

const App: AppType = ({ Component, pageProps }) => {
  const initialState = cookieToInitialState(config, headers().get('cookie'));

  return (
    <div
      className={`${electroliceFont.variable} ${bebasFont.variable} font-sans`}
    >
      <WagmiProviderComp initialState={initialState}>
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
