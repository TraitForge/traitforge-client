import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';
import { Wrapper, Modal } from '@/components';
import '@/styles/main.scss';
import { ModalProvider } from '@/utils/modalContext'; 

const App = ({ Component, pageProps }) => (
  <ModalProvider> 
    <ContextProvider>
      <Wrapper>
        <DefaultSeo {...SEO} />
        <Modal /> 
        <Component {...pageProps} />
      </Wrapper>
    </ContextProvider>
  </ModalProvider>
);

export default App;
