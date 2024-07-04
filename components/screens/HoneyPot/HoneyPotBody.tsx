import { Button } from '~/components';
import styles from '~/styles/honeypot.module.scss';
import { formatEther } from 'viem';
import { useNukeFundBalance } from '~/hooks';

type HoneyPotBodyTypes = {
  handleStep: () => void;
};

export const HoneyPotBody = ({ handleStep }: HoneyPotBodyTypes) => {
  const { data: nukeFundBalance } = useNukeFundBalance();

  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-extra-large font-bebas">
          {Number(formatEther(nukeFundBalance)).toFixed(4)} ETH
        </p>
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
