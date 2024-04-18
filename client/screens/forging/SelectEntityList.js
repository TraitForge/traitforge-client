import { useState } from 'react';

import { EntityCard } from '@/components';
import { FiltersHeader } from '@/components';

export const SelectEntityList = ({
  entitiesForForging,
  handleSelectedFromPool,
}) => {
  const [sortOption, setSortOption] = useState('all');

  const getSortedEntities = () => {
    if (sortOption === 'all') return entitiesForForging;
    return entitiesForForging.sort((a, b) => {
      if (sortOption === 'priceLowHigh') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === 'priceHighLow') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });
  };

  const sortedEntities = getSortedEntities();

  const handleSort = type => setSortOption(type);

  return (
    <div className="bg-dark-81 md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[70vw] md:rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select entity
        </h3>
        <FiltersHeader
          sortOption={sortOption}
          handleSort={handleSort}
          color="orange"
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {sortedEntities?.map((entity, index) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              index={index}
              onClick={() => handleSelectedFromPool(entity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
