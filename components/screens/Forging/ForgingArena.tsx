import { Entity, EntityForging } from '~/types';
import { ArenaCenter } from './ArenaCenter';
import { ArenaItem } from './ArenaItem';
import { ArenaItemForger } from './ArenaItemForger';

type ForgingArenaTypes = {
  selectedFromPool: EntityForging | null;
  handleEntityListModal?: () => void;
  handleOwnerEntityList?: () => void;
  areEntitiesForged?: boolean;
  selectedFromWallet: Entity | null;
};

export const ForgingArena = ({
  selectedFromPool,
  handleEntityListModal,
  handleOwnerEntityList,
  // TODO:add this latter
  areEntitiesForged,
  selectedFromWallet,
}: ForgingArenaTypes) => {
  return (
    <div className="hidden px-5 flex-col max-md:gap-y-10 md:gap-x-5 md:grid md:grid-cols-3 max-w-[1440px] md:px-[15px] lg:px-[100px] xl:px-[200px] lg:gap-x-[80px] 3xl:gap-x-[111px] ">
      <ArenaItemForger
        handleEntityListModal={handleEntityListModal}
        selectedFromPool={selectedFromPool}
        btnLabel="select entity from the pool button"
      />
      <ArenaCenter
        selectedFromPool={selectedFromPool}
        selectedFromWallet={selectedFromWallet}
        areEntitiesForged={areEntitiesForged}
      />
      <ArenaItem
        handleOwnerEntityList={handleOwnerEntityList}
        selectedFromWallet={selectedFromWallet}
        btnLabel="select entity from wallet button"
      />
    </div>
  );
};
