import { useState, useEffect } from 'react';
import { EntityCard, FiltersHeader } from '@/components';
import { isForger } from '@/utils/utils';

export const WalletEntityModal = ({
  ownerEntities,
  walletProvider,
  handleSelectedFromWallet,
  handleOwnerEntityList
}) => {
  const [filteredEntities, setFilteredEntities] = useState([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const results = await Promise.all(
          ownerEntities.map(async entity => {
            const isEntityForger = await isForger(walletProvider, entity);
            console.log('isForger:', isEntityForger);
            if (!isEntityForger) {
              return entity;
            }
            return null;
          })
        );

        const filtered = results.filter(result => result !== null);
        console.log('entity tokenids:', filtered);
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in fetchAndFilterEntities:', error);
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities, walletProvider]);

  return (
    <div className="bg-dark-81 md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[70vw] md:rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select From Wallet
        </h3>
        <FiltersHeader color="orange" filterOptions={['your mergers']} />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {filteredEntities?.map(entity => (
            <EntityCard
              key={entity}
              entity={entity}
              borderType="orange"
              onSelect={() => {
                handleSelectedFromWallet(entity);
                handleOwnerEntityList();
                console.log('entityid:', entity);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
