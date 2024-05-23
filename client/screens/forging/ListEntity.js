import React, { useState, useEffect } from 'react';
import styles from '@/styles/forging.module.scss';
import { EntityCard } from '@/components';
import { ListingHeader } from '@/screens/forging/ListingHeader';
import { isForger } from '@/utils/utils';

export const ListEntity = ({ ownerEntities, walletProvider, handleStep, setSelectedForListing }) => {
  const [filteredEntities, setFilteredEntities] = useState([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const results = await Promise.all(ownerEntities.map(async (entity) => {
          const isEntityForger = await isForger(walletProvider, entity);
          console.log("isForger:", isEntityForger);
          if (isEntityForger) {
            return entity;
          }
          return null;
        }));

        const filtered = results.filter(result => result !== null);
        console.log("entity tokenids:", filtered);
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in fetchAndFilterEntities:', error);
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities, walletProvider]);

  return (
    <div className={styles.forgingPage2}>
      <div className="container pt-16 md:pt-[134px] flex flex-col h-full">
        <ListingHeader
          handleStep={handleStep}
          step="two"
        />
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
          {filteredEntities?.map(entity => (
            <EntityCard
              key={entity.id}
              entity={entity}
              borderType='orange'
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
