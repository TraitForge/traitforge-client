'use client';

import { useEffect, useState, useRef } from 'react';
import { Slider, Button, LoadingSpinner, Modal } from '~/components';
import axios from 'axios';
import {
  useCurrentGeneration,
  useMintPrice,
  useMintToken,
  useMintWithBudget,
  usePriceIncrement,
  useUpcomingMints,
  useWhitelistEndTime,
  useNukeFundBalance,
  useEthPrice
} from '~/hooks';
import {
  Mint,
  MintingHeader,
  BudgetMint,
  ReferInputs,
  MintProgressBar
} from '~/components/screens'
import { parseEther, formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { WHITELIST } from '~/constants/whitelist';
import Countdown from 'react-countdown';
import { calculateMinimumBudgetMint } from '~/utils';
import dynamic from 'next/dynamic';
import _ from 'lodash';

const Home = () => {
  const { address } = useAccount();
  const { data: nukeFundBalance } = useNukeFundBalance();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(formatEther(nukeFundBalance)) * ethPrice;
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
  useUpcomingMints(mintPrice, currentGeneration);

  const isLoading =
    isMintTokenPending || isMintWithBudgetPending || isUpcomingMintsFetching;

  const [step, setStep] = useState('one');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referModalOpen, setReferModalOpen] = useState<boolean>(false);
  const [twitterHandle, setTwitterHandle] = useState('')
  const [smallLoading, setSmallLoading] = useState<boolean | null>(false);

  const handleReferModal = () => setReferModalOpen(prevState => !prevState);

  const ClientComponent = dynamic(() => import('~/components/screens/Home/refCode'), {
    ssr: false, 
  });

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
    if (!storedReferralCode && !address && address === undefined) {
      setReferModalOpen(true);
    } else {
      setReferModalOpen(false);
    }
  }, [address, referralCode]);

  const refreshEntities = async () => {
    refetchMintPrice();
    if (mintPrice === undefined || mintPrice === null) {
      return;
    }
    refetchCurrentGeneration();
    refetchPriceIncrement();
  };

  const getProof = (): `0x${string}`[] => {
    const res = WHITELIST.find(
      item => item.address.toLowerCase() === address?.toLowerCase()
    );
  
    return (res?.proof ?? []).map((p) => {
      return p.startsWith('0x') ? p as `0x${string}` : `0x${p}` as `0x${string}`;
    });
  };

  const handleSubmitTwitter = async () => {
    setSmallLoading(true)
    const refCode = twitterHandle;
    await fetch('/api/incrementMint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refCode }),
      });
      localStorage.setItem('referralCode', refCode);
      setSmallLoading(false)
      setReferModalOpen(false);
  };

  const handleMintEntity = async () => {
    await onMintToken(getProof());
    await axios.post('/api/users', {
      walletAddress: address,
      entity: upcomingMints[0]?.entropy,
    });
    setStep('one');
  };

  const handleMintBatchEntity = async () => {
    const minAmountMinted = calculateMinimumBudgetMint(mintPrice, budgetAmount);
    await onMintWithBudget(parseEther(budgetAmount), getProof(), minAmountMinted);
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
      const refCode = referralCode;
      await fetch('/api/batchMintReferral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refCode, hash, address }),
      });
    };

    if (isMintWithBudgetConfirmed) {
      handleAPIBatchReq();
    }
  }, [isMintWithBudgetConfirmed, referralCode, hash, address]);

  const upcomingMint = upcomingMints.length > 0 ? upcomingMints[0] : null;

    useEffect(() => {
      const handleMintInc = async () => {
        const refCode = referralCode;
        await fetch('/api/incrementMint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refCode }),
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
          className="text-[24px] md:test-[36px] my-1 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-light-blue via-neon-blue to-light-blue animate-pulse shadow-lg"
        >
          🚀 NUKEFUND: ${usdAmount.toLocaleString()} 🚀
        </h1>
          <h1
            title="Mint Your Traitforge Entity"
            className="headers text-[36px] my-1 text-center md:text-extra-large"
          >
            Mint your traitforge entity
          </h1>
          <MintProgressBar ethPrice={mintPrice} generation={currentGeneration}/>
          <p className="text-xs">
            <ClientComponent setReferralCode={setReferralCode}/>
          </p>
          <h2 className="pt-6">
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
          className="mint-container min-h-screen 3xl:pt-[100px]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.6) 49%, rgba(0, 0, 0, 0.6) 100%), url('/images/home.png')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
          }}
        >
          {referModalOpen && !referralCode && (
         <Modal
         isOpen={referModalOpen}
         closeModal={handleReferModal}
         modalClasses="items-end pb-4"
         >
         <ReferInputs
          handleReferModal={handleReferModal}
          setTwitterHandle={setTwitterHandle}
          twitterHandle={twitterHandle}
          handleSubmitTwitter={handleSubmitTwitter}
          smallLoading={smallLoading}
          />
          </Modal>
          )}
          <MintingHeader handleStep={setStep} step={step} />
          {content}
        </div>
    );
};

export default Home;
