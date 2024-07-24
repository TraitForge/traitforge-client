import { Entity, EntityForging } from '~/types';
import { ArenaItem } from './ArenaItem';
import { ArenaItemForger } from './ArenaItemForger';
import { ArenaCenter } from './ArenaCenter';

type ForgingArenaTypes = {
  selectedFromPool: EntityForging | null;
  handleEntityListModal?: () => void;
  handleOwnerEntityList?: () => void;
  areEntitiesForged?: boolean;
  selectedFromWallet: Entity | null;
};

export const MobileForgingArena = ({
  selectedFromPool,
  handleEntityListModal,
  handleOwnerEntityList,
  // TODO:add this latter
  areEntitiesForged,
  selectedFromWallet,
}: ForgingArenaTypes) => {
  return (
    <div className="grid md:hidden grid-cols-4 gap-5 px-8">
      <div className="col-span-2 col-start-2">
        <ArenaCenter
          selectedFromPool={selectedFromPool}
          selectedFromWallet={selectedFromWallet}
          areEntitiesForged={areEntitiesForged}
        />
      </div>
      <div className="col-span-2">
        <ArenaItemForger
          handleEntityListModal={handleEntityListModal}
          selectedFromPool={selectedFromPool}
          btnLabel="select entity from the pool button"
        />
      </div>
      <div className="col-span-2">
        <ArenaItem
          handleOwnerEntityList={handleOwnerEntityList}
          selectedFromWallet={selectedFromWallet}
          btnLabel="select entity from wallet button"
        />
      </div>
    </div>
  );
};
