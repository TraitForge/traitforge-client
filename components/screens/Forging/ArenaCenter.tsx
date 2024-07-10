import Image from 'next/image';
import { EntityCard } from '~/components';
import { BorderType, EntityForging } from '~/types';

type ArenaCenterTypes = {
  selectedFromPool: EntityForging | null;
  areEntitiesForged: boolean;
};

export const ArenaCenter = ({
  selectedFromPool,
  areEntitiesForged,
}: ArenaCenterTypes) => {
  return (
    <div className="hidden md:flex items-center justify-center h-full  relative">
      <Image
        src="/images/claimentity.png"
        alt="claim box"
        width={500}
        height={700}
        className="3xl:scale-[1.22] w-full h-full"
      />
      {areEntitiesForged && selectedFromPool && (
        <div className="absolute top-1/2 left-1/2 max-h-[300p] -translate-x-1/2 -translate-y-1/2 scale-[0.65]">
          <EntityCard
            entity={selectedFromPool}
          />
        </div>
      )}
    </div>
  );
};
