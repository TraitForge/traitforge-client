import React, { useEffect, useState } from 'react';

import styles from '@/styles/honeypot.module.scss';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { HoneyPotHeader } from '@/screens/honey-pot/HoneyPotHeader';
import { EntityCard } from '@/components';
import { HoneyPotBody } from '@/screens/honey-pot/HoneyPotBody';
import { useContextState } from '@/utils/context';

const HoneyPot = observer(() => {
  const { ownerEntities, getOwnersEntities } = useContextState();
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
          <div className="overflow-y-scroll flex-1 pt-8">
            <div className="grid grid-cols-3 lg:grid-cols-5 lg:px-20 gap-x-[15px] gap-y-5 md:gap-y-10">
            {ownerEntities.map(entity => (
                <EntityCard 
                key={entity.tokenId} 
                tokenId={entity.tokenId}
                entropy={entropy} 
                />
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default HoneyPot;
