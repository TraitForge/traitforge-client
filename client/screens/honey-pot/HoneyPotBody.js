import { Button } from '@/components';
import styles from '@/styles/honeypot.module.scss';

export const HoneyPotBody = ({ handleStep, ethAmount, usdAmount }) => {
  return (
    <>
      <div className={styles.frameContainer}>
        <p className="text-extra-large">{ethAmount} ETH</p>
        <p className="text-[40px]">= ${usdAmount} USD</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button
          borderColor="#FC62FF"
          bg="rgba(12, 0, 31,0.8)"
          text="nuke entity"
          onClick={handleStep}
        />
      </div>
    </>
  );
};
