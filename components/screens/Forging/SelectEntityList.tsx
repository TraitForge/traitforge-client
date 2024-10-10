import React, { useState, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { EntityCard, FiltersHeader } from '~/components';
import { EntityForging } from '~/types';

import { useAccount } from 'wagmi';

const ITEMS_PER_PAGE = 20;

type SelectEntityListTypes = {
  entitiesForForging: EntityForging[];
  handleSelectedFromPool: (entity: EntityForging) => void;
  handleEntityListModal: () => void;
  handleGenerationFilter: (value: string) => void;
  handleSortingFilter: (value: string) => void;
  generationFilter: string;
  sortingFilter: string;
};

export const SelectEntityList = ({
  entitiesForForging,
  handleSelectedFromPool,
  handleEntityListModal,
  handleGenerationFilter,
  handleSortingFilter,
  generationFilter,
  sortingFilter,
}: SelectEntityListTypes) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { address } = useAccount();

  const handleFilterChange = (
    selectedOption: SingleValue<
      { value: number; label: string } | { value: string; label: string }
    >,
    type: string
  ) => {
    if (type === 'generation') {
      handleGenerationFilter(String(selectedOption?.value || ''));
      setCurrentPage(1);
    } else if (type === 'sorting') {
      handleSortingFilter(String(selectedOption?.value || ''));
      setCurrentPage(1);
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

  const totalPages = Math.ceil(
    filteredAndSortedListings.length / ITEMS_PER_PAGE
  );
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedListings.slice(start, end);
  }, [currentPage, filteredAndSortedListings]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-dark-81 w-[98vw] md:w-[80vw] h-[95vh] md:h-[85vh] 2xl:w-[80vw] md:rounded-[30px] mx-auto py-10 md:py-4 px-3 md:px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h2 className="text-center max-md:mt-5 pb-0 md:pb-10 text-[40px] uppercase font-electrolize">
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 md:gap-x-[12px] gap-y-3">
          {paginatedListings.map(listing => (
            <EntityCard
              key={listing.tokenId}
              entity={listing}
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-neon-orange text-black rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-neon-orange text-black rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
