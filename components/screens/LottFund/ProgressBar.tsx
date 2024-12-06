import React, { useEffect, useState } from 'react';

type BarTypes = {
  amountBidded: number; 
};

const MAX_BIDDED = 800;

export const ProgressBar = ({ amountBidded }: BarTypes) => {
  const [progress, setProgress] = useState<{ number: number; percentage: string } | null>(null);

  useEffect(() => {
    try {
      const bidProgress = calculateProgress(Number(amountBidded));
      setProgress(bidProgress);
    } catch (err: any) {
      setProgress(null);
    }
  }, [amountBidded]);

  const calculateProgress = (currentBidded: number) => {
    const percentage = (currentBidded / MAX_BIDDED) * 100;
    const number = Math.min(currentBidded, MAX_BIDDED); 

    return {
      number,
      percentage: percentage.toFixed(2),
    };
  };

  return (
    <div className="text-center">
      {progress && (
        <div>
          <p className="text-base md:text-xl text-gray-300 mb-2">
            {progress.number}/{MAX_BIDDED} BIDS REACHED
          </p>
          <div style={{ width: '100%', height: '40px' }}>
            <progress value={progress.number} max={MAX_BIDDED} className="custom-progress2"></progress>
          </div>
        </div>
      )}
    </div>
  );
};
