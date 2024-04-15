import Image from 'next/image';

import { Modal } from '@/components';
import { WalletEntityModal } from './WalletEntityModal';
import { EntityCard } from '@/components';
import { ArenaCenter } from './ArenaCenter';
import { ArenaItem } from './ArenaItem';

export const FongingArena = ({
  selectedFromPool,
  ownerEntities,
  handleEntityListModal,
  // TODO:add this latter
  areEntitiesForged = false,
  selectedFromWallet,
}) => {
  return (
    <div className="grid grid-cols-3 max-w-[1440px] md:px-[100px] max-2xl:max-h-[400px] 3xl:px-[200px] lg:gap-x-[80px] 3xl:gap-x-[111px]">
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/PoolSelectCard.png"
        selectedFromPool={selectedFromPool}
        btnLabel="select entity fro the pool button"
      />
      <ArenaCenter areEntitiesForged={areEntitiesForged} />
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/WalletSelectCard.png"
        selectedFromWallet={selectedFromWallet}
        btnLabel="select entity from wallet button"
      />
    </div>
  );
};
