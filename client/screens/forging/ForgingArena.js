import { ArenaCenter } from './ArenaCenter';
import { ArenaItem } from './ArenaItem';

export const ForgingArena = ({
  selectedFromPool,
  handleEntityListModal,
  handleOwnerEntityList,
  // TODO:add this latter
  areEntitiesForged = false,
  selectedFromWallet,
}) => {
  return (
    <div className="flex flex-col max-md:gap-y-20 md:grid md:grid-cols-3 max-w-[1440px] md:px-[100px] lg:px-[150px] xl:px-[200px] lg:gap-x-[80px] 3xl:gap-x-[111px]">
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/PoolSelectCard.png"
        selectedFromPool={selectedFromPool}
        btnLabel="select entity fro the pool button"
        className="hidden md:flex"
      />
      <ArenaItem
        handleEntityListModal={handleEntityListModal}
        image="/images/poolSelectedCardSm.png"
        selectedFromPool={selectedFromPool}
        btnLabel="select entity fro the pool button"
        className="flex md:hidden"
      />
      <ArenaCenter areEntitiesForged={areEntitiesForged} />
      <ArenaItem
        handleEntityListModal={handleOwnerEntityList}
        image="/images/WalletSelectCard.png"
        selectedFromWallet={selectedFromWallet}
        btnLabel="select entity from wallet button"
        className="hidden md:flex"
      />
      <ArenaItem
        handleEntityListModal={handleOwnerEntityList}
        image="/images/walletSelectCardSm.png"
        selectedFromWallet={selectedFromWallet}
        btnLabel="select entity from wallet button"
        className="flex md:hidden"
      />
    </div>
  );
};
