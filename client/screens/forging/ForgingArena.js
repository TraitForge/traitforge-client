import Image from 'next/image';

import styles from '@/styles/forging.module.scss';

export const FongingArena = ({ selectedFromPool, handleSelectedFromPool }) => {
  return (
    <div className={styles.forgecardsrow}>
      {selectedFromPool ? (
        <EntityCard
          entity={selectedFromPool}
          onSelect={handleSelectedFromPool}
        />
      ) : (
        <div
          className="flex justify-center item-center h-full"
        //   onClick={scrollToEntityList}
        >
          <Image
            src="/images/PoolSelectCard.png"
            alt="forge place holder"
            className="w-full h-auto"
            width={400}
            height={600}
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
      <div className="flex justify-center item-center  h-full">
        <Image
          src="/images/WalletSelectCard.png"
          alt="forge place holder"
          width={400}
          height={600}
          className="w-full h-full"
          onClick={() => openModalWithContent(modalContentToMerge)}
        />
      </div>
      {/* {isOpen && (
        <Modal background="/images/forge-background.jpg">
          {modalContentToMerge}
        </Modal>
      )} */}
    </div>
  );
};
