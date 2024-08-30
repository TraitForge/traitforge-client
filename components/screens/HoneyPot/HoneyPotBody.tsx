import { Button } from '~/components';
import styles from '~/styles/honeypot.module.scss';
import { formatEther } from 'viem';
import { useEthPrice, useNukeFundBalance } from '~/hooks';

type HoneyPotBodyTypes = {
  handleStep: () => void;
};

export const HoneyPotBody = ({ handleStep }: HoneyPotBodyTypes) => {
  const { data: nukeFundBalance } = useNukeFundBalance();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(formatEther(nukeFundBalance)) * ethPrice;

  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-[40px] font-bebas">
          {Number(formatEther(nukeFundBalance)).toFixed(4)} ETH
        </p>
        <p className="text-[40px] font-bebas">
          = ${usdAmount.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button
          bg="rgba(12, 0, 31,0.8)"
          variant="purple"
          text="nuke entity"
          onClick={handleStep}
          textClass="font-bebas !text-[32px] !px-20 capitalize"
        />
      </div>
    </>
  );
};
