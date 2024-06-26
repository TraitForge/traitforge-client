import React, { useState, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { EntityCard, FiltersHeader } from '~/components';
import { BorderType, EntityForging } from '~/types';

type SelectEntityListTypes = {
  entitiesForForging: EntityForging[];
  handleSelectedFromPool: (entity: EntityForging) => void;
  handleEntityListModal: () => void;
};

export const SelectEntityList = ({
  entitiesForForging,
  handleSelectedFromPool,
  handleEntityListModal,
}: SelectEntityListTypes) => {
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  const handleFilterChange = (
    selectedOption: SingleValue<
      { value: number; label: string } | { value: string; label: string }
    >,
    type: string
  ) => {
    if (type === 'generation') {
      setGenerationFilter(String(selectedOption?.value || ''));
    } else if (type === 'sorting') {
      setSortingFilter(String(selectedOption?.value || ''));
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = entitiesForForging.filter(listing => {
      if (!listing.isListed) return false;
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }
      return true;
    });

    if (sortingFilter === 'price_low_to_high') {
      filtered.sort((a, b) => Number(a.fee) - Number(b.fee));
    } else if (sortingFilter === 'price_high_to_low') {
      filtered.sort((a, b) => Number(b.fee) - Number(a.fee));
    }

    return filtered;
  }, [generationFilter, sortingFilter, entitiesForForging]);

  return (
    <div className="bg-dark-81 w-[95vw] md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[80vw] md:rounded-[30px] mx-auto py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h2 className="text-center pb-10 text-[40px] uppercase ">
          Select From Pool
        </h2>
        <FiltersHeader
          filterOptions={['Listed forgers']}
          color="orange"
          handleFilterChange={(selectedOption, type) =>
            handleFilterChange(selectedOption, type)
          }
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {filteredAndSortedListings.map(listing => (
            <EntityCard
              key={listing.tokenId}
              entity={listing}
              borderType={BorderType.ORANGE}
              onSelect={() => {
                handleSelectedFromPool(listing);
                handleEntityListModal();
              }}
              showPrice
              displayPrice={listing.fee}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
