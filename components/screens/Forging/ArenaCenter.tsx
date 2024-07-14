import Image from 'next/image';
import { PossibleEntityCard } from '~/components';
import { calculateEntityAttributes } from '~/utils';
import { BorderType, Entity, EntityRole } from '~/types';

type ArenaCenterTypes = {
  selectedFromPool: Entity | null;
  selectedFromWallet: Entity | null;
  areEntitiesForged?: boolean;
};

export const ArenaCenter = ({
  selectedFromPool,
  selectedFromWallet,
  areEntitiesForged,
}: ArenaCenterTypes) => {
  
  const possibleEntity = (selectedFromWallet: Entity, selectedFromPool: Entity): Entity => {
    const paddedEntropyWallet = Number(selectedFromWallet.paddedEntropy);
    const paddedEntropyPool = Number(selectedFromPool.paddedEntropy);
    const entropy = Math.floor((paddedEntropyPool + paddedEntropyWallet) / 2);
    const attributes = calculateEntityAttributes(entropy.toString());

    const newEntity: Entity = {
      tokenId: Math.floor(Math.random() * 100000),
      paddedEntropy: entropy,
      generation: Math.max(selectedFromWallet.generation, selectedFromPool.generation) + 1,
      role: attributes.role as EntityRole,
      forgePotential: attributes.forgePotential,
      performanceFactor: attributes.performanceFactor,
      nukeFactor: attributes.nukeFactor,
    };
    return newEntity;
  };

  let entity: Entity | null = null;
  if ( selectedFromPool && selectedFromWallet) {
    entity = possibleEntity(selectedFromWallet, selectedFromPool);
  }

  return (
    <div className="hidden md:flex items-center justify-center h-full relative">
      <Image
        src="/images/claimentity.png"
        alt="claim box"
        width={500}
        height={700}
        className="3xl:scale-[1.22] w-full h-full"
      />
      {entity && selectedFromPool && selectedFromWallet && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <PossibleEntityCard entity={entity} />
        </div>
      )}
    </div>
  );
};

export default ArenaCenter;
