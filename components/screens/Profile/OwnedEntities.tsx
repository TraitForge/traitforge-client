import { useAccount } from 'wagmi';

import { Button, EntityCard } from '~/components';
import { useOwnerEntities } from '~/hooks';
import { Entity } from '~/types';

export const OwnedEntities = () => {
  const { address } = useAccount();

  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');
  return (
    <section className="container mt-10">
      <div className="flex max-md:flex-col gap-y-5 items-center justify-between">
        <h1 className="text-[48px]">Entites owned</h1>
        <Button
          bg="#023340"
          text="Unlist an Entity"
          style={{ marginBottom: '40px' }}
          onClick={() => {}}
          variant="blue"
        />
      </div>
      {ownerEntities.length > 0 && (
        <div className="bg-blue rounded-2xl p-[30px]">
          <div className="pb-5  grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:text-large md:w-full text-white md:mb-8 gap-4 flex-1 overflow-y-scroll">
            {ownerEntities.map((entity: Entity) => (
              <EntityCard key={entity.tokenId} entity={entity} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
