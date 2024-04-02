import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';
import { Wrapper } from '@/components';
import '@/styles/main.scss';
import { ContextProvider } from '@/utils/context';
import "../styles/index.css"

const App = ({ Component, pageProps }) => (
  <ContextProvider>
    <Wrapper>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Wrapper>
  </ContextProvider>
);

export default App;
