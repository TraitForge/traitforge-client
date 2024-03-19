import './styles/App.css';
import TraitForge from './components/TraitForge'; 
import OwnerEntityContext from './components/OwnerEntityContext';

function App({ Component, pageProps }) {
  return (
    <OwnerEntityContext>
    <TraitForge>
      <Component {...pageProps} />
    </TraitForge>
    </OwnerEntityContext>
  );
}

export default App;
