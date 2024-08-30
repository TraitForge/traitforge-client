'use client';

import { useEffect, useState } from 'react';
import { Slider, Button, BudgetModal, LoadingSpinner } from '~/components';
import {
  useCurrentGeneration,
  useMintPrice,
  useMintToken,
  useMintWithBudget,
  usePriceIncrement,
  useUpcomingMints,
  useWhitelistEndTime,
} from '~/hooks';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { WHITELIST } from '~/constants/whitelist';
import Countdown from 'react-countdown';
import _ from 'lodash';

const Home = () => {
  const { address } = useAccount();
  const { data: whitelistEndTime } = useWhitelistEndTime();
  const { data: currentGeneration, refetch: refetchCurrentGeneration } =
    useCurrentGeneration();
  const { data: mintPrice, refetch: refetchMintPrice } = useMintPrice();
  const { data: priceIncrement, refetch: refetchPriceIncrement } =
    usePriceIncrement();
  const {
    onWriteAsync: onMintToken,
    isPending: isMintTokenPending,
    isConfirmed: isMintTokenConfirmed,
  } = useMintToken();
  const {
    hash,
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
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (isMintTokenConfirmed || isMintWithBudgetConfirmed) {
      refetchCurrentGeneration();
      refetchMintPrice();
      refetchPriceIncrement();
    }
  }, [isMintTokenConfirmed, isMintWithBudgetConfirmed]);

  useEffect(() => {
    const storedReferralCode = localStorage.getItem('referralCode');
    if (storedReferralCode) {
      setReferralCode(storedReferralCode);
    }
  }, []);

  const getProof = () => {
    const res = WHITELIST.find(
      item => item.address.toLowerCase() === address?.toLowerCase()
    );
    return res?.proof ?? [];
  };

  const handleMintEntity = async () => {
    onMintToken(mintPrice, getProof());
  };

  const handleMintBatchEntity = async () => {
    await onMintWithBudget(parseEther(budgetAmount), getProof());
  };

  useEffect(() => {
    const handleAPIBatchReq = async () => {
      await fetch('/api/batchMintReferral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode, hash, address }),
      });
    };
  
    if (isMintWithBudgetConfirmed) {
      handleAPIBatchReq();
    }
  }, [isMintWithBudgetConfirmed, referralCode, hash, address]);
 

    useEffect(() => {
      const handleMintInc = async () => {
        await fetch('/api/incrementMint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referralCode }),
        });
      };
    
      if (isMintTokenConfirmed) {
        handleMintInc();
      }
    }, [isMintTokenConfirmed, referralCode]);

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col">
        <LoadingSpinner color="#0ff" />
        {(isMintTokenPending || isMintWithBudgetPending) && (
          <p className="mt-3 text-[#0ff]">
            {isMintTokenPending ? 'Minting entity' : 'Minting entities'}
          </p>
        )}
      </div>
    );

  return (
    <div
      className="mint-container  py-5 "
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.6) 49%, rgba(0, 0, 0, 0.6) 100%), url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1
        title="Mint Your Traitforge Entity"
        className="headers text-[36px] my-6 text-center md:text-extra-large"
      >
        Mint your traitforge entity
      </h1>
      <h2>
        <Countdown
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return null;
            } else {
              return (
                <>
                  <span>Whitelist mint finishes in</span>
                  &nbsp;
                  <span>
                    {_.padStart(String(days), 2, '0')}:
                    {_.padStart(String(hours), 2, '0')}:
                    {_.padStart(String(minutes), 2, '0')}:
                    {_.padStart(String(seconds), 2, '0')}
                  </span>
                </>
              );
            }
          }}
          date={new Date(whitelistEndTime * 1000)}
        />
      </h2>
      <div className="w-full flex justify-center">
        <Slider
          mintPrice={mintPrice}
          priceIncrement={priceIncrement}
          currentGeneration={currentGeneration}
          upcomingMints={upcomingMints}
        />
      </div>
      <div className="max-md:px-5 flex flex-col max-md:mt-5">
        <Button
          onClick={handleMintEntity}
          bg="#023340"
          variant="blue"
          text={`Mint For ${formatEther(mintPrice)} ETH`}
          style={{ marginBottom: '25px' }}
          textClass="font-electrolize"
        />
        <Button
          onClick={() => setModalOpen(true)}
          bg="#023340"
          text={`Mint With a Budget`}
          textClass="font-electrolize"
          variant="secondary"
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
