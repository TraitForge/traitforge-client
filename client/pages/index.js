import { useContextState } from '@/utils/context';
import { LoadingSpinner, Slider, Button } from '@/components';

const Home = () => {
  const { isLoading, mintEntityHandler } = useContextState();

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mint-container min-h-[100vh]" style={{backgroundImage: "url('/images/home.png')", backgroundPosition: "center", backgroundSize: "cover"}}>
      <span className="mint-text">Mint your traitforge entity</span>
      <div className="w-full pb-10">
        <Slider />
      </div>
      <Button bg="#023340" borderColor="#0ADFDB" text="Mint For 0.01 ETH" />
    </div>
  );
};

export default Home;
