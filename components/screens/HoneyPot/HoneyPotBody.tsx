import { Button } from '~/components';
import styles from '~/styles/honeypot.module.scss';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';

type HoneyPotBodyTypes = {
  handleStep: () => void;
};

export const HoneyPotBody = ({ handleStep }: HoneyPotBodyTypes) => {
  const { data: balanceInfo } = useBalance();
  const ethBalance = Number(formatEther(balanceInfo?.value || 0n));

  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-extra-large font-bebas">{ethBalance} ETH</p>
        {/* TODO: Fetch USD Price later */}
        {/* <p className="text-[40px] font-bebas">= ${usdAmount} USD</p> */}
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
