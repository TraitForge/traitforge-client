import { useContextState } from '@/utils/context';
import { LoadingSpinner, Slider } from '@/components';

const Home = () => {
  const { isLoading, mintEntityHandler } = useContextState();

  return (
    <div className="mint-container">
      <span className="mint-text">Mint your traitforge entity</span>
      <img
        src={isLoading ? <LoadingSpinner /> : '/images/mintbutton.png'}
        className="mint-button"
        onClick={mintEntityHandler}
      />
      <div className="nexttokenslider">
        <Slider />
      </div>
    </div>
  );
};

export default Home;
