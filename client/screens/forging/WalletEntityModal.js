import { useState, useEffect } from 'react';
import { EntityCard, FiltersHeader } from '@/components';

export const WalletEntityModal = ({
  ownerEntities,
  handleSelectedFromWallet,
  handleOwnerEntityList
}) => {
  const [filteredEntities, setFilteredEntities] = useState([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const filtered = ownerEntities.filter(entity => entity.role === "Merger");
        console.log("Filtered entities:", filtered);
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in fetchAndFilterEntities:', error);
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities]);


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
