import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { Button, EntityCard, LoadingSpinner } from '~/components';
import { Entity, EntityForging, EntityTrading } from '~/types';
import {
  useListedEntitiesByUser,
  useOwnerEntities,
  useUnlistEntityForForging,
  useUnlistEntityForSale,
} from '~/hooks';
import { icons } from '~/components/icons';

export const OwnedEntities = () => {
  const ITEMS_PER_PAGE = 12;
  const [currentStep, setCurrentStep] = useState(1);
  const [showForging, setShowForging] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { address } = useAccount();
  const [selectedForUnlisting, setSelectedForUnlisting] = useState<
    EntityTrading | EntityForging | null
  >(null);

  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');

  const { data: entitiesListedByUser, refetch: refetchListedEntities } =
    useListedEntitiesByUser(address || '0x0', 0, 700);
    
  const {
    onWriteAsync: onUnlistTrading,
    isPending: isUnlistTradingPending,
    isConfirmed: isUnlistTradingConfirmed,
  } = useUnlistEntityForSale();
  const {
    onWriteAsync: onUnlistForging,
    isPending: isUnlistForgingPending,
    isConfirmed: isUnlistForgingConfirmed,
  } = useUnlistEntityForForging();

  const isLoading = isUnlistTradingPending || isUnlistForgingPending;
  const totalPages = Math.ceil(ownerEntities.length / ITEMS_PER_PAGE);

  const handleSelectEntity = (entity: EntityTrading | EntityForging) => {
    setSelectedForUnlisting(entity);
    setCurrentStep(3);
  };

  const paginatedEntities = ownerEntities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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


  const toggleView = () => {
    setShowForging(!showForging);
  };

  const handleUnlist = () => {
    if (!selectedForUnlisting) {
      return;
    }
    if ((selectedForUnlisting as EntityTrading).seller) {
      onUnlistTrading(selectedForUnlisting.tokenId);
    } else {
      onUnlistForging(selectedForUnlisting.tokenId);
    }
  };

  useEffect(() => {
    if (isUnlistTradingConfirmed || isUnlistForgingConfirmed) {
      setSelectedForUnlisting(null);
      setCurrentStep(1);
      refetchListedEntities();
      refetchOwnerEntities();
    }
  }, [isUnlistTradingConfirmed, isUnlistForgingConfirmed]);

  const entitiesWrapper = classNames('rounded-2xl p-[30px]', {
    'bg-blue ': ownerEntities.length > 0,
  });

  return (
    <section className="container mt-10">
      {currentStep === 1 && (
        <>
          <div className="flex max-md:flex-col gap-y-5 items-center justify-between">
            <h2 className="text-[48px]">Entities owned</h2>
            <Button
              bg="#023340"
              text="Unlist an Entity"
              style={{ marginBottom: '40px' }}
              onClick={() => setCurrentStep(2)}
              variant="blue"
            />
          </div>
          <div className={entitiesWrapper}>
          <div className="pb-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:text-large md:w-full text-white md:mb-8 gap-5 flex-1 overflow-y-scroll">
              {paginatedEntities.map((entity: Entity) => (
                  <EntityCard key={entity.tokenId} entity={entity} />
              ))}
          </div>
          </div>
          <div className="flex justify-between items-center mt-4 pb-[50px] px-[10px] md:px-[50px]">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-neon-blue text-black rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2  bg-neon-blue text-black rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
        </>
      )}
      {currentStep === 2 && (
        <>
          <div className="flex gap-y-5 items-center">
            <button
              className="bg-blue p-5 px-6 rounded-md"
              onClick={() => setCurrentStep(1)}
            >
              {icons.arrow({ className: 'text-neon-blue' })}
            </button>
            <h2 className="text-[28px] lg:text-[48px] ml-8">Select entity to unlist</h2>
          </div>
          <button
          onClick={toggleView}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          {showForging ? 'Show Trading Listings' : 'Show Forging Listings'}
        </button>
          {entitiesListedByUser.length > 0 && (
            <div className="bg-blue rounded-2xl p-[30px] mt-10">
              <div className="pb-5 gap-4 md:gap-6">
                 {showForging && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                     {entitiesListedByUser
                       .filter((entity: EntityForging | EntityTrading) => 'fee' in entity)
                       .map((entity: EntityForging) => (
                         <EntityCard
                           key={entity.tokenId}
                           entity={entity}
                           onSelect={() => handleSelectEntity(entity)}
                           showPrice={true}
                           displayPrice={entity.fee} // Show fee for forging
                         />
                       ))}
                   </div>
                 )}
                {!showForging && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {entitiesListedByUser
                      .filter((entity: EntityForging | EntityTrading) => 'price' in entity)
                      .map((entity: EntityTrading) => (
                        <EntityCard
                          key={entity.tokenId}
                          entity={entity}
                          onSelect={() => handleSelectEntity(entity)}
                          showPrice={true}
                          displayPrice={entity.price} // Show price for trading
                        />
                      ))}
                  </div>
                )}
              </div>
          </div>
        )}
        </>
      )}
      {currentStep === 3 && selectedForUnlisting && (
        <div className="w-full md:w-[60%] xl:w-[40%] 2xl:w-[35%] mx-auto py-5  justify-center flex flex-col bg-blue rounded-[20px] items-center h-full">
          <div className="mt-3 mb-4 px-2 xl:px-4">
            <EntityCard
              entity={selectedForUnlisting}
              onSelect={() => handleSelectEntity(selectedForUnlisting)}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-3 pb-3 mt-5">
            {isLoading ? (
              <LoadingSpinner color="#0ff" />
            ) : (
              <>
                <Button
                  bg="#023340"
                  variant="blue"
                  text="Unlist Entity"
                  onClick={handleUnlist}
                  disabled={isLoading}
                />
                <div className="justify-center mt-1">
                  <Button
                    bg="#023340"
                    variant="blue"
                    text="Back"
                    onClick={() => setCurrentStep(2)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
