import { useEffect, useState } from 'react';
import { Button } from '~/components';
import { handlePrice } from '~/utils/utils';
import { useContextState } from '~/utils/context';
import styles from '@/styles/honeypot.module.scss';

type HoneyPotBodyTypes = {
  handleStep: () => void;
  usdAmountInitial?: string;
  ethAmountInitial?: string;
};

export const HoneyPotBody = ({
  handleStep,
  usdAmountInitial,
  ethAmountInitial,
}: HoneyPotBodyTypes) => {
  const [ethAmount, setEthAmount] = useState(ethAmountInitial);
  const [usdAmount, setUsdAmount] = useState(usdAmountInitial);
  const { infuraProvider } = useContextState();

  useEffect(() => {
    const handleEthPrice = setInterval(async () => {
      const { ethAmount: _ethAmount, usdAmount: _usdAmount } =
        await handlePrice(infuraProvider);
      setEthAmount(_ethAmount);
      setUsdAmount(_usdAmount);
    }, 5000);
    return () => clearInterval(handleEthPrice);
  }, []);

  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-extra-large font-bebas">{ethAmount} ETH</p>
        <p className="text-[40px] font-bebas">= ${usdAmount} USD</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button
          borderColor="#FC62FF"
          bg="rgba(12, 0, 31,0.8)"
          text="nuke entity"
          onClick={handleStep}
          textClass="font-bebas text-[40px]"
        />
      </div>
    </>
  );
};
