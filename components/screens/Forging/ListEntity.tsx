import React, { useState, useEffect } from 'react';
import { EntityCard } from '~/components';
import { ListingHeader } from './ListingHeader';
import { Entity, EntityForging, EntityRole } from '~/types';

type ListEntityTypes = {
  ownerEntities: Entity[];
  entitiesForForging: EntityForging[],
  handleStep: (value: string) => void;
  setSelectedForListing: (entity: Entity) => void;
};

export const ListEntity = ({
  ownerEntities,
  entitiesForForging,
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

  const isEntityListedForForging = (entity: Entity): boolean => {
    return entitiesForForging.some(listedEntity => listedEntity.tokenId === entity.tokenId);
  };

  return (
    <div className="h-full w-full ">
      <div className="pt-5 h-full bg-custom-radial">
        <div className="container flex flex-col ">
          <ListingHeader handleStep={handleStep} step="two" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-[10px] gap-y-2 lg:gap-y-2">
            {filteredEntities?.map(entity => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                isOwnedByUser={isEntityListedForForging(entity)}
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
