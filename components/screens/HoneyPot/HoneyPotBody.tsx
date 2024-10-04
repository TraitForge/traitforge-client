import { Button } from '~/components';
import styles from '~/styles/honeypot.module.scss';
import { formatEther } from 'viem';
import { useEthPrice, useNukeFundBalance } from '~/hooks';
import _ from 'lodash';
import Countdown from 'react-countdown'; // Assuming you are using react-countdown

type HoneyPotBodyTypes = {
  handleStep: () => void;
  timeLeft: number | null;
  isLocked: boolean;
};

export const HoneyPotBody = ({ handleStep, timeLeft, isLocked }: HoneyPotBodyTypes) => {
  const { data: nukeFundBalance } = useNukeFundBalance();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(formatEther(nukeFundBalance)) * ethPrice;

  return (
    <>
    <div className={`${styles.frameContainer} ${isLocked ? styles.locked : ''}`}>
      <p className="text-[40px] font-bebas">
        {Number(formatEther(nukeFundBalance)).toFixed(4)} ETH
      </p>
      <p className="text-[40px] font-bebas">
        = ${usdAmount.toLocaleString()}
      </p>

      {isLocked && (
        <div className={styles.lockOverlay}>
          <p className={`${styles.empText} text-[40px] font-bebas`}>EMP is active</p>
          <Countdown
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return null;
              } else {
                return (
                  <>
                    <span>Unlocks in</span>
                    &nbsp;
                    <span>
                      {_.padStart(String(days), 2, '0')}:
                      {_.padStart(String(hours), 2, '0')}:
                      {_.padStart(String(minutes), 2, '0')}:
                      {_.padStart(String(seconds), 2, '0')}
                    </span>
                  </>
                );
              }
            }}
            date={new Date(timeLeft * 1000)}
          />
        </div>
      )}
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
