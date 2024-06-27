import React, { useState, useEffect } from 'react';
import { EntityCard } from '@/components';
import { ListingHeader } from '@/screens/forging/ListingHeader';

export const ListEntity = ({ ownerEntities, handleStep, setSelectedForListing }) => {
  const [filteredEntities, setFilteredEntities] = useState([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const filtered = ownerEntities.filter(entity => entity.role === 'Forger');
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in fetchAndFilterEntities:', error);
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities]);

  return (
    <div className="h-full w-full">
      <div className="container pt-5 flex flex-col h-full">
        <ListingHeader handleStep={handleStep} step="two" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
          {filteredEntities?.map(entity => (
            <EntityCard
              key={entity.tokenId}
              entity={entity}
              borderType="orange"
              onSelect={() => {
                setSelectedForListing(entity);
                handleStep('three');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEntity;
