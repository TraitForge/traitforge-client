import { useEffect, useState } from 'react';
import { Slider, Button, BudgetModal, LoadingSpinner } from '~/components';
import {
  useCurrentGeneration,
  useMintPrice,
  useMintToken,
  useMintWithBudget,
  useUpcomingMints,
} from '~/hooks';
import { formatEther, parseEther } from 'viem';

const Home = () => {
  const { data: currentGeneration, refetch: refetchCurrentGeneration } =
    useCurrentGeneration();
  const { data: mintPrice, refetch: refetchMintPrice } = useMintPrice();
  const {
    onWriteAsync: onMintToken,
    isPending: isMintTokenPending,
    isConfirmed: isMintTokenConfirmed,
  } = useMintToken();
  const {
    onWriteAsync: onMintWithBudget,
    isPending: isMintWithBudgetPending,
    isConfirmed: isMintWithBudgetConfirmed,
  } = useMintWithBudget();
  const { data: upcomingMints, isFetching: isUpcomingMintsFetching } =
    useUpcomingMints(mintPrice);

  const isLoading =
    isMintTokenPending || isMintWithBudgetPending || isUpcomingMintsFetching;

  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [loadingText] = useState('');

  useEffect(() => {
    if (isMintTokenConfirmed || isMintWithBudgetConfirmed) {
      refetchCurrentGeneration();
      refetchMintPrice();
    }
  }, [isMintTokenConfirmed, isMintWithBudgetConfirmed]);

  const handleMintEntity = async () => {
    onMintToken(mintPrice);
  };

  const handleMintBatchEntity = async () => {
    onMintWithBudget(parseEther(budgetAmount));
  };

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col">
        <LoadingSpinner color="#0ff" />
        {loadingText && <p className="mt-3 text-[#0ff]">{loadingText}</p>}
      </div>
    );

  return (
    <div
      className="mint-container h-full overflow-auto pb-5"
      style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1
        title="Mint Your Traitforge Entity"
        className="headers text-[36px] mb-2.5 text-center md:text-extra-large"
      >
        Mint your traitforge entity
      </h1>
      <div className="w-full flex justify-center overflow-hidden">
        <Slider
          mintPrice={mintPrice}
          currentGeneration={currentGeneration}
          upcomingMints={upcomingMints}
        />
      </div>
      <div className="max-md:px-5 flex flex-col max-md:mt-5">
        <Button
          onClick={handleMintEntity}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint 1 For ${formatEther(mintPrice)} ETH`}
          style={{ marginBottom: '25px' }}
          textClass="font-electrolize"
        />
        <Button
          onClick={() => setModalOpen(true)}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint With a Budget`}
          textClass="font-electrolize"
        />
        {isModalOpen && (
          <BudgetModal
            bg="#023340"
            borderColor="#0ADFDB"
            budgetAmount={budgetAmount}
            setBudgetAmount={setBudgetAmount}
            onSubmit={handleMintBatchEntity}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
