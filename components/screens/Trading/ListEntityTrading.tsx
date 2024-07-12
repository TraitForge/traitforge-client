import { useState, useMemo } from 'react';
import { SingleValue } from 'react-select';
import { EntityCard, FiltersHeader } from '~/components';
import { BorderType, Entity } from '~/types';

type ListEntityTradingTypes = {
  ownerEntities: Entity[];
  setSelectedForSale: (entity: Entity) => void;
  handleStep: (value: string) => void;
};

export const ListEntityTrading = ({
  ownerEntities,
  setSelectedForSale,
  handleStep,
}: ListEntityTradingTypes) => {
  const [sortOption, setSortOption] = useState('all');
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

  const filteredAndSortedOwnerEntities = useMemo(() => {
    let filtered = ownerEntities.filter(listing => {
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => Number(a.nukeFactor) - Number(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => Number(b.nukeFactor) - Number(a.nukeFactor));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, ownerEntities]);

  return (
    <div className="overflow-y-auto flex-1 bg-custom-radial">
      <div className="container ">
        <FiltersHeader
          sortOption={sortOption}
          handleSort={setSortOption}
          pageType="nuke"
          color="green"
          handleFilterChange={handleFilterChange}
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 mt-10 gap-x-3  md:gap-x-[15px] gap-y-7 lg:gap-y-4">
          {filteredAndSortedOwnerEntities.map(entity => (
            <EntityCard
              key={entity.tokenId}
              entity={entity}
              onSelect={() => {
                setSelectedForSale(entity);
                handleStep('three');
                console.log('Selected entity:', entity);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
