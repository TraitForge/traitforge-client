import React, { useState, useEffect } from 'react';
import { EntityCard } from '~/components';
import { ListingHeader } from './ListingHeader';
import { Entity, EntityRole } from '~/types';

type ListEntityTypes = {
  ownerEntities: Entity[];
  handleStep: (value: string) => void;
  setSelectedForListing: (entity: Entity) => void;
};

export const ListEntity = ({
  ownerEntities,
  handleStep,
  setSelectedForListing,
}: ListEntityTypes) => {
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const filtered = ownerEntities.filter(
          entity => entity.role === EntityRole.FORGER
        );
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in fetchAndFilterEntities:', error);
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities]);

  return (
    <div className="h-full w-full ">
      <div className="pt-5 h-full bg-custom-radial">
        <div className="container flex flex-col ">
          <ListingHeader handleStep={handleStep} step="two" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-[15px] gap-y-3 lg:gap-y-4">
            {filteredEntities?.map(entity => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                onSelect={() => {
                  setSelectedForListing(entity);
                  handleStep('three');
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEntity;
