import { Button } from '~/components';
import styles from '~/styles/honeypot.module.scss';
import { formatEther } from 'viem';
import { ProgressBar } from './ProgressBar';
import { useEthPrice, useLottFundBalance, useLottFundBidAmount, useLottFundMaxBidAmount } from '~/hooks';
import _ from 'lodash';

type LottFundBodyTypes = {
  handleStep: () => void;
  handleClaim: () => void;
  wonAmount: number;
};

export const LottFundBody = ({ handleStep, handleClaim, wonAmount }: LottFundBodyTypes) => {
  const { data: lottFundBalance } = useLottFundBalance();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(formatEther(lottFundBalance)) * ethPrice;
  const { data: bidAmount } = useLottFundBidAmount();
  const { data: maxBidAmount } = useLottFundMaxBidAmount();

  return (
    <>
    <div className="flex flex-row justify-center items-center w-screen">
    <div>
     <h6 className="text-[56px] md:text-extra-large">
          Lotto <br/>Fund
        </h6>
      <p className="text-[40px] font-bebas">
        {Number(formatEther(lottFundBalance)).toFixed(4)} ETH
      </p>
      <p className="text-[40px] font-bebas">
        = ${usdAmount.toLocaleString()}
      </p>
    </div>
    </div>
          <div className="flex flex-col pt-20 justify-center items-center">
          <ProgressBar
            amountBidded={Number(bidAmount)}
          />
          <Button
            bg="rgba(12, 0, 31,0.8)"
            variant="purple"
            text="Bid entity"
            onClick={handleStep}
            textClass="font-bebas !text-[32px] !px-20 capitalize mt-3"
          />
          <Button
            bg="rgba(12, 0, 31,0.8)"
            variant="purple"
            text={`Claim: ${wonAmount} ETH`}
            onClick={handleClaim}
            textClass="font-bebas !text-[22px] px-10 capitalize mt-4 active:!px-9 active:!text-[18px] active:text-gray-500"
          />
        </div>
        </>
  );
};
