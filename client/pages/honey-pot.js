import React, { useEffect, useState } from 'react';
import styles from '@/styles/honeypot.module.scss';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { useContextState } from '@/utils/context';
import { HoneyPotHeader } from '@/screens/honey-pot/HoneyPotHeader';
import { Button } from '@/components';
import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';

const HoneyPot = observer(() => {
  const { ethAmount, usdAmount } = useContextState();
  const { ownerEntities } = appStore;
  const [step, setStep] = useState('one');

  useEffect(() => {
    appStore.getOwnersEntities();
  }, []);

  return (
    <div className={styles.honeyPotContainer}>
      <div className="container  flex flex-col h-full">
        <HoneyPotHeader step={step} handleStep={() => setStep('one')} />
        {step === 'one' ? (
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
                onClick={() => setStep('two')}
              />
              <Button
                borderColor="#FC62FF"
                bg="rgba(12, 0, 31,0.8)"
                text="nuke history"
              />
              <p className="uppercase text-large">no nuke history found</p>
            </div>
          </>
        ) : (
          <div className="overflow-y-scroll flex-1">
            <div className="grid grid-cols-5 px-20 gap-x-[15px] gap-y-10">
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
              <MarketplaceEntityCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default HoneyPot;
