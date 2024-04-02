import { useContextState } from '@/utils/context';
import { LoadingSpinner, Slider, Button } from '@/components';

const Home = () => {
  const { isLoading, mintEntityHandler } = useContextState();

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mint-container">
      <span className="mint-text">Mint your traitforge entity</span>
      <Button bg="#023340" borderColor="#0ADFDB" text="Mint For 0.01 ETH" />

      <div className="nexttokenslider">
        {/* <Slider /> */}
      </div>
    </div>
  );
};

export default Home;
