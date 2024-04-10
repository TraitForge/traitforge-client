import Image from 'next/image';
import { useState } from 'react';

import styles from '@/styles/forging.module.scss';
import { Modal } from '@/components';

export const FongingArena = ({
  selectedFromPool,
  ownerEntities,
  handleEntityListModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalContentToMerge = (
    <div className={styles.entityDisplay}>
      <h1>Select entity</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard entity={entity} index={index} />
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-3 max-w-[1440px] px-[200px] gap-x-[111px]">
      {selectedFromPool ? (
        <EntityCard
          entity={selectedFromPool}
          // onSelect={handleSelectedFromPool}
        />
      ) : (
        <div
          className="flex justify-center item-center cursor-pointer h-full"
          onClick={handleEntityListModal}
        >
          <Image
            src="/images/PoolSelectCard.png"
            alt="forge place holder"
            className="w-full h-auto"
            width={400}
            height={500}
          />
        </div>
      )}
      <div className="flex justify-center item-center h-full">
        <Image
          src="/images/claimentity.png"
          alt="claim box"
          width={500}
          height={700}
          className="scale-[1.3] w-full h-full"
        />
      </div>
      <div
        className="flex justify-center item-center cursor-pointer h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src="/images/WalletSelectCard.png"
          alt="forge place holder"
          width={400}
          height={500}
          className="w-full h-full"
        />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          background="/images/forge-background.jpg"
        >
          {modalContentToMerge}
        </Modal>
      )}
    </div>
  );
};
