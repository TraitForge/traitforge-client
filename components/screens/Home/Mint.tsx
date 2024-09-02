import React, { useState } from 'react';
import { Button } from '~/components';
import { EntitySliderCard } from '../../common/Slider/EntitySliderCard';
import { Entropy } from '~/types';
import { formatEther } from 'viem';
import { FiRefreshCw } from 'react-icons/fi';

type MintScreenTypes = {
  budgetAmount: string;
  mintPrice: bigint;
  refreshEntities: () => void;
  setStep: (value: string) => void;
  upcomingMint: Entropy | null;
  setBudgetAmount: (value: string) => void;
  onClose: () => void;
  bg?: string;
  currentGeneration: number;
  borderColor?: string;
  handleMintEntity: () => void;
  handleMintWithBudget: () => void;
};

export const Mint = ({
  setStep,
  mintPrice,
  upcomingMint,
  refreshEntities,
  currentGeneration,
  bg,
  borderColor,
  handleMintEntity,
}: MintScreenTypes) => {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleRefresh = () => {
      setIsSpinning(true);
      refreshEntities(); 
    };
  
    const handleAnimationEnd = () => {
      setIsSpinning(false);
    };

  return (
      <div className="relative md:bg-zinc-900 md:bg-opacity-85 max-md:px-5 w-full md:w-[70%] xl:w-[50%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <button
        className={`absolute top-4 left-4 ${isSpinning ? 'animate-spin-once' : ''}`}
        onClick={handleRefresh}
        onAnimationEnd={handleAnimationEnd}
      >
        <FiRefreshCw size={24} />
      </button>
      <div className="max-md:order-1">
      {upcomingMint ? (
          <EntitySliderCard 
            currentGeneration={currentGeneration}
            entropy={upcomingMint.entropy}
            price={formatEther(mintPrice)}
            showPrice 
          />
        ) : (
          <p className="text-center text-neutral-400">No upcoming mint available</p>
        )}
      </div>
      <div className="max-md:order-3 max-md:px-10 mt-4">
        <Button
          onClick={handleMintEntity}
          bg="#023340"
          variant="blue"
          text={`Mint For ${formatEther(mintPrice)} ETH`}
          style={{ marginBottom: '25px' }}
          textClass="font-electrolize"
        />
        <Button
          onClick={() => setStep('three')}
          bg="#023340"
          text={`Mint With a Budget`}
          textClass="font-electrolize"
          variant="secondary"
        />
      </div>
    </div>
  );
  
};
