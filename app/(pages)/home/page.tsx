'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { Slider, Button, LoadingSpinner } from '~/components';
import {
  useCurrentGeneration,
  useMintPrice,
  useMintToken,
  useMintWithBudget,
  usePriceIncrement,
  useUpcomingMints,
  useWhitelistEndTime,
} from '~/hooks';
import { Mint, MintingHeader, BudgetMint } from '~/components/screens';
import { parseEther } from 'viem';
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

  const [step, setStep] = useState('one');
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

  const refreshEntities = async () => {
    refetchMintPrice();
    if (mintPrice === undefined || mintPrice === null) {
      return;
    }
    refetchCurrentGeneration();
    refetchPriceIncrement();
  };

  const getProof = () => {
    const res = WHITELIST.find(
      item => item.address.toLowerCase() === address?.toLowerCase()
    );
    return res?.proof ?? [];
  };

  const handleMintEntity = async () => {
    await onMintToken(mintPrice, getProof());
    await axios.post('/api/users', {
      walletAddress: address,
      entity: upcomingMints[0]?.entropy,
    });
    setStep('one');
  };

  const handleMintBatchEntity = async () => {
    await onMintWithBudget(parseEther(budgetAmount), getProof());
    await axios.post('/api/users', {
      walletAddress: address,
      entity: upcomingMints[0]?.entropy,
    });
    setStep('one');
  };

  const handleExit = () => {
    setStep('one');
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

  const upcomingMint = upcomingMints.length > 0 ? upcomingMints[0] : null;

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

  let content;

  switch (step) {
    case 'three':
      content = (
        <BudgetMint
          bg="#023340"
          setStep={setStep}
          borderColor="#0ADFDB"
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
          handleMintWithBudget={handleMintBatchEntity}
          onClose={handleExit}
        />
      );
      break;
    case 'two':
      content = (
        <>
          {upcomingMint ? (
            <Mint
              mintPrice={mintPrice}
              upcomingMint={upcomingMint}
              currentGeneration={currentGeneration}
              refreshEntities={refreshEntities}
              bg="#023340"
              setStep={setStep}
              borderColor="#0ADFDB"
              handleMintEntity={handleMintEntity}
              budgetAmount={budgetAmount}
              setBudgetAmount={setBudgetAmount}
              handleMintWithBudget={handleMintBatchEntity}
              onClose={handleExit}
            />
          ) : (
            <p className="text-center text-neutral-400">
              No upcoming mint available
            </p>
          )}
        </>
      );
      break;
    default:
      content = (
        <>
          <h1
            title="Mint Your Traitforge Entity"
            className="headers text-[36px] my-1 text-center md:text-extra-large"
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
          <div className="intro-container flex flex-col items-center mt-5">
            <div className="flex">
              <Button
                onClick={() => setStep('two')}
                style={{ border: '1px solid #0ff' }}
                bg="#023340"
                text={`MINT NOW`}
                textClass="font-electrolize"
                variant="secondary"
              />
            </div>
          </div>
        </>
      );
  }

  return (
    <div
      className="mint-container py-1 h-full"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.6) 49%, rgba(0, 0, 0, 0.6) 100%), url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <MintingHeader handleStep={setStep} step={step} />
      {content}
    </div>
  );
};

export default Home;
