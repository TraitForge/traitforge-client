import { Button } from '@/components';
import { useContextState } from '@/utils/context';
import styles from '@/styles/honeypot.module.scss';

export const HoneyPotBody = ({ handleStep }) => {
  const { ethAmount, usdAmount } = useContextState();

  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-extra-large">{ethAmount} ETH</p>
        <p className="text-[40px]">= ${usdAmount} USD</p>
      </div>
      <div className="flex flex-col gap-9 justify-center items-center">
        <Button
          borderColor="#FC62FF"
          bg="rgba(12, 0, 31,0.8)"
          text="nuke entity"
          onClick={handleStep}
        />
        <Button
          borderColor="#FC62FF"
          bg="rgba(12, 0, 31,0.8)"
          text="nuke history"
        />
        <p className="uppercase text-large">no nuke history found</p>
      </div>
    </>
  );
};