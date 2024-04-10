import { useState } from 'react';

import styles from '@/styles/forging.module.scss';

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

  return (
    <div className={styles.entityListContainer}>
      <div className="border-b border-white">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select entity
        </h3>
        <div>tabs goes here</div>
      </div>
      {sortedEntities?.map((entity, index) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          index={index}
          onClick={() => handleSelectedFromPool(entity)}
        />
      ))}
    </div>
  );
};
