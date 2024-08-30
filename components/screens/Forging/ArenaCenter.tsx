import Image from 'next/image';
import { PossibleEntityCard } from '~/components';
import { calculateEntityAttributes } from '~/utils';
import { Entity, EntityRole } from '~/types';
import classNames from 'classnames';

type ArenaCenterTypes = {
  selectedFromPool: Entity | null;
  selectedFromWallet: Entity | null;
  areEntitiesForged?: boolean;
  className?: string;
};

export const ArenaCenter = ({
  selectedFromPool,
  selectedFromWallet,
  areEntitiesForged,
  className,
}: ArenaCenterTypes) => {
  const possibleEntity = (
    selectedFromWallet: Entity,
    selectedFromPool: Entity
  ): Entity => {
    const paddedEntropyWallet = Number(selectedFromWallet.paddedEntropy);
    const paddedEntropyPool = Number(selectedFromPool.paddedEntropy);
    const entropy = Math.floor((paddedEntropyPool + paddedEntropyWallet) / 2);
    const attributes = calculateEntityAttributes(entropy.toString());

    const newEntity: Entity = {
      tokenId: Math.floor(Math.random() * 100000),
      paddedEntropy: entropy,
      generation:
        Math.max(selectedFromWallet.generation, selectedFromPool.generation) +
        1,
      role: attributes.role as EntityRole,
      forgePotential: attributes.forgePotential,
      performanceFactor: attributes.performanceFactor,
      nukeFactor: attributes.nukeFactor,
    };
    return newEntity;
  };

  let entity: Entity | null = null;
  if (selectedFromPool && selectedFromWallet) {
    entity = possibleEntity(selectedFromWallet, selectedFromPool);
  }

  const imageClasses = classNames('3xl:scale-[1.22] w-full h-full md:flex', {
    hidden: entity && selectedFromPool && selectedFromWallet,
    flex: !entity && !selectedFromPool && !selectedFromWallet,
  });

  return (
    <div className="flex items-center justify-center h-full relative">
      <Image
        src="/images/claimentity.png"
        alt="claim box"
        width={500}
        height={700}
        className={imageClasses}
      />
      {entity && selectedFromPool && selectedFromWallet && (
        <div className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <PossibleEntityCard entity={entity} wrapperClass={className} />
        </div>
      )}
    </div>
  );
};

export default ArenaCenter;
