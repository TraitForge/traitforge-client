import { useState } from 'react';
import { EntityCard, FiltersHeader } from '@/components';

export const WalletEntityModal = ({ ownerEntities, generationFilter, setGenerationFilter }) => {
  const [sortOption, setSortOption] = useState('mergers');
  const [sortingFilter, setSortingFilter] = useState('');

  const handleSort = type => setSortOption(type);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const getFilteredEntities = () => {
    let filteredEntities = ownerEntities.filter(entity => entity.type === 'merger');
  
    if (generationFilter) {
      filteredEntities = filteredEntities.filter(entity => entity.generation.toString() === generationFilter);
    }
  
    if (sortingFilter === 'price_high_to_low') {
      filteredEntities.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortingFilter === 'price_low_to_high') {
      filteredEntities.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
  
    return filteredEntities;
  };

  const filteredEntities = getFilteredEntities();

  return (
    <div className="bg-dark-81 md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[70vw] md:rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select From Wallet
        </h3>
        <FiltersHeader
          color="orange"
          filterOptions={['mergers']}
          handleFilterChange={(selectedOption, type) =>
            handleFilterChange(selectedOption, type)
          }
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
          sortOption={sortOption}
          handleSort={handleSort}
          hideSortingSelect={true}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {filteredEntities?.map((entity, index) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              index={index}
              onClick={() => handleSelectedFromWallet(entity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

