import { useState } from 'react';
import cls from 'classnames';

import { EntityListHeader } from './EntityListHeader';
import { EntityCard } from '@/components';

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
    <div className="bg-dark-81 w-[80vw] h-[85vh] 2xl:w-[70vw] rounded-[30px] py-10 px-5">
      <div className="border-b border-white">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select entity
        </h3>
        <EntityListHeader sortOption={sortOption} handleSort={handleSort} />
      </div>
      <div className="grid grid-col-5">
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
  );
};
