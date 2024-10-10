import React, { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { useEthPrice, useNukeFundBalance } from '~/hooks';

const STARTING_PRICE = 0.005;
const INCREMENT = 0.0000245; 
const MAX_MINTS = 10000; 

type BarTypes = {
  ethPrice: bigint; 
  generation: number;
};

export const MintProgressBar = ({ ethPrice, generation }: BarTypes) => {
  const { data: nukeFundBalance } = useNukeFundBalance();
  const { data: ethCost } = useEthPrice();
  const [mintProgress, setMintProgress] = useState<{ mintNumber: number; progressPercentage: string } | null>(null);
  const usdAmount = Number(formatEther(nukeFundBalance)) * ethCost;

  useEffect(() => {
    try {
      const priceInEth = Number(ethPrice) / 1e18; 
      const progress = calculateMintProgress(priceInEth);
      setMintProgress(progress);
    } catch (err: any) {
      setMintProgress(null); 
    }
  }, [ethPrice]);

  const calculateMintProgress = (currentPrice: number) => {
    if (currentPrice < STARTING_PRICE) {
      throw new Error('Current price is lower than the starting price.');
    }

    const mintNumber = Math.floor((currentPrice - STARTING_PRICE) / INCREMENT) + 1;

    if (mintNumber > MAX_MINTS) {
      throw new Error('Price exceeds the maximum number of mints.');
    }

    const progressPercentage = (mintNumber / MAX_MINTS) * 100;

    return {
      mintNumber,
      progressPercentage: progressPercentage.toFixed(2),
    };
  };

  return (
    <div className="mint-progress-checker text-center">
      <p className="text-base md:text-xl text-gray-300 mb-2">NUKEFUND: ${usdAmount.toLocaleString()}</p>
      {mintProgress && (
        <div>
          <p className="text-base md:text-xl text-gray-300 mb-2">
          {mintProgress.progressPercentage}% OF GEN {generation} MINTED
          </p>
          <div style={{ width: '100%', height: '40px' }}>
          <progress value={mintProgress.mintNumber} max={10000} className="custom-progress"></progress>
          </div>
        </div>
      )}
    </div>
  );
};
