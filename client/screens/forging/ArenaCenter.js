import Image from 'next/image';

import { EntityCard } from '@/components';

export const ArenaCenter = ({ areEntitiesForged }) => {
  return (
    <div className="flex items-center justify-center h-full  relative">
      <Image
        src="/images/claimentity.png"
        alt="claim box"
        width={500}
        height={700}
        className="3xl:scale-[1.3] w-full h-full"
      />
      {areEntitiesForged && (
        <div className="absolute top-1/2 left-1/2 max-h-[300p] -translate-x-1/2 -translate-y-1/2 scale-[0.65]">
          <EntityCard entity={selectedFromPool} borderType="orange" />
        </div>
      )}
    </div>
  );
};
