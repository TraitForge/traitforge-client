import { EntityCard, FiltersHeader } from '@/components';

export const SelectEntityList = ({
  entitiesForForging,
  handleSelectedFromPool,
  handleEntityListModal
}) => {


  return (
    <div className="bg-dark-81 md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[70vw] md:rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select From Pool
        </h3>
        <FiltersHeader
          color="orange"
          filterOptions={['forgers listed']}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {entitiesForForging.map((listing, index) => (
            <EntityCard
              key={listing.tokenId}
              entity={listing.tokenId}
              price={listing.price}
              index={index}
              onClick={() => { 
                handleSelectedFromPool(listing);
                handleEntityListModal();
              }}
              showPrice
            />
          ))}
        </div>
      </div>
    </div>
  );
};
