import Image from 'next/image';

import { Modal } from '@/components';
import { WalletEntityModal } from './WalletEntityModal';
import { EntityCard } from '@/components';
import { ArenaCenter } from './ArenaCenter';
import { ArenaItem } from './ArenaItem';


export const ForgingArena = ({
  selectedFromPool,
  ownerEntities,
  handleEntityListModal,
  // TODO:add this latter
  areEntitiesForged = false,
  selectedFromWallet,
}) => {
  return (
    <div className="grid grid-cols-3 max-w-[1440px] px-[200px] gap-x-[111px]">
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/PoolSelectCard.png"
        selectedFromPool={selectedFromPool}
      />
      <ArenaCenter areEntitiesForged={areEntitiesForged} />
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/WalletSelectCard.png"
        selectedFromWallet={selectedFromWallet}
      />
    </div>
  );
};
