import { useState, useEffect, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { EntityCard, FiltersHeader } from '~/components';
import { Entity, EntityRole } from '~/types';

const ITEMS_PER_PAGE = 20;

type WalletEntityModalTypes = {
  ownerEntities: Entity[];
  handleSelectedFromWallet: (entity: Entity) => void;
  handleOwnerEntityList: () => void;
};

export const WalletEntityModal = ({
  ownerEntities,
  handleSelectedFromWallet,
  handleOwnerEntityList,
}: WalletEntityModalTypes) => {
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    const filterEntities = () => {
      try {
        const filtered = ownerEntities.filter(
          entity => entity.role === EntityRole.MERGER
        );
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in filterEntities:', error);
      }
    };

    filterEntities();
  }, [ownerEntities]);

  const handleFilterChange = (
    selectedOption: SingleValue<
      { value: number; label: string } | { value: string; label: string }
    >,
    type: string
  ) => {
    if (type === 'generation') {
      setGenerationFilter(String(selectedOption?.value || ''));
      setCurrentPage(1); // Reset to page 1 on filter change
    } else if (type === 'sorting') {
      setSortingFilter(String(selectedOption?.value || ''));
      setCurrentPage(1); // Reset to page 1 on filter change
    }
  };

  const filteredListings = useMemo(() => {
    let filtered = filteredEntities.filter(listing => {
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => Number(a.nukeFactor) - Number(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => Number(b.nukeFactor) - Number(a.nukeFactor));
    }

    return filtered;
  }, [generationFilter, sortingFilter, filteredEntities]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredListings.slice(start, end);
  }, [currentPage, filteredListings]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-dark-81 w-[97vw] md:w-[80vw] h-[95vh] md:h-[90vh] 2xl:w-[80vw] md:rounded-[30px] py-10 md:py-4 px-3 md:px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h2 className="text-center max-md:mt-5 pb-0 md:pb-10 text-[40px] uppercase font-electrolize">
          Select From Wallet
        </h2>
        <FiltersHeader
          filterOptions={['your mergers']}
          pageType="nuke"
          color="orange"
          handleFilterChange={handleFilterChange}
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 md:gap-x-[12px] gap-y-3">
          {paginatedListings.map(entity => (
            <EntityCard
              key={entity.tokenId}
              entity={entity}
              onSelect={() => {
                handleSelectedFromWallet(entity);
                handleOwnerEntityList();
              }}
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
