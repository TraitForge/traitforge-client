import React, { useEffect, useState } from 'react';

import styles from '@/styles/honeypot.module.scss';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { HoneyPotHeader } from '@/screens/honey-pot/HoneyPotHeader';
import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';
import { HoneyPotBody } from '@/screens/honey-pot/HoneyPotBody';

const HoneyPot = observer(() => {
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
          <HoneyPotBody handleStep={() => setStep('two')} />
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
