'use client';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import classNames from 'classnames';
import { Button, EntityCard, LoadingSpinner, Modal } from '~/components';
import { Entity, EntityForging, EntityTrading } from '~/types';
import { shortenAddress } from '~/utils';
import {
  useListedEntitiesByUser,
  useOwnerEntities,
  useUnlistEntityForForging,
  useUnlistEntityForSale,
} from '~/hooks';
import { usePathname } from 'next/navigation';

type WalletModalTypes = {
  isOpen: boolean;
  closeModal: () => void;
  balanceInETH: string | number;
};

export const WalletModal = ({
  isOpen,
  closeModal,
  balanceInETH,
}: WalletModalTypes) => {
  const pathname = usePathname();
  const { address } = useAccount();
  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');
  const { data: entitiesListedByUser, refetch: refetchListedEntities } =
    useListedEntitiesByUser(address || '0x0', 0, 1450);
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
  const [selectedForUnlisting, setSelectedForUnlisting] = useState<
    EntityTrading | EntityForging | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);

  const shortAddress = address ? shortenAddress(address) : 'Not connected';

  const containerClasses = classNames(
    'bg-dark-81 flex justify-center items-center border-[5px] rounded-xl max-w-[90%]',
    {
      'border-neon-orange': pathname === '/forging',
      'border-neon-green': pathname === '/trading',
      'border-neon-purple': pathname === '/nuke-fund',
      'border-neon-green-yellow': pathname === '/stats',
      'border-primary': pathname === '/',
    }
  );

  const handleSelectEntity = (tokenId: number) => {
    const entity =
      entitiesListedByUser.find(e => e.tokenId === tokenId) ?? null;
    setSelectedForUnlisting(entity);
    setCurrentStep(3); // Move to step 3
  };

  const handleUnlist = () => {
    if (!selectedForUnlisting) {
      return;
    }
    if ((selectedForUnlisting as EntityTrading).seller) {
      // EntityTrading
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

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      containerClass={containerClasses}
    >
      {currentStep === 1 && (
        <div className="flex items-center flex-col justify-center h-[80vh]">
          <div className="flex items-center mt-8 px-[50px] pb-[36px] gap-x-[20px] sm:gap-x-[70px]">
            <div className="flex items-center gap-x-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="none"
                viewBox="0 0 46 46"
              >
                <path
                  fill="#FC62FF"
                  fillOpacity="0.4"
                  d="M23 46c12.703 0 23-10.297 23-23S35.703 0 23 0 0 10.297 0 23s10.297 23 23 23z"
                ></path>
                <path
                  fill="#FEC8FF"
                  d="M22.996 30.449L14 25l8.996 13L32 25l-9.004 5.449z"
                ></path>
                <path
                  fill="#FEC8FF"
                  d="M32 23.485L23 29l-9-5.515L23 8l9 15.485z"
                ></path>
                <path
                  fill="#F866FB"
                  fillOpacity="0.96"
                  d="M31.995 23.273l-8.997-4.09V8.343l8.997 14.93zM32 24.978l-9.002 12.679v-7.365L32 24.978zM22.997 19.183v9.407l-8.995-5.317 8.995-4.09z"
                ></path>
                <path
                  fill="#EC3BEF"
                  fillOpacity="0.99"
                  d="M32 23.348L23 29V19l9 4.348z"
                ></path>
              </svg>
              <div>
                <p className="text-neutral-100 text-sm sm:text-base">ETH</p>
                <span className="text-white text-md sm:text-large">
                  {balanceInETH}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-2.5">
              <span className="rounded-full w-[46px] flex justify-center items-center h-[46px] bg-[rgba(14,235,129,0.39)]">
                <FaWallet color="#0EEB81" />
              </span>
              <div>
                <p className="text-neutral-100 text-sm sm:text-base">
                  Wallet Address
                </p>
                <span className="text-white text-md sm:text-large">
                  {shortAddress}
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/2 mx-auto flex justify-center">
            <Button
              bg="#023340"
              text="Unlist an Entity"
              style={{ marginBottom: '40px' }}
              onClick={() => setCurrentStep(2)}
              variant="blue"
            />
          </div>
          {ownerEntities.length > 0 && (
            <div className="pb-5 w-11/12 grid grid-cols-1 xs:grid-cols-2 xs:w-full sm:grid-cols-3 sm:w-11/12 lg:grid-cols-5 md:text-large md:w-full text-white md:mb-8 gap-4 px-10 flex-1 overflow-y-scroll">
              {ownerEntities.map((entity: Entity) => (
                <EntityCard key={entity.tokenId} entity={entity} />
              ))}
            </div>
          )}
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex items-center flex-col justify-center h-[80vh]">
          <h3 className="pt-10 text-[18px] md:text-[36px] pb-3">
            Select an entity to unlist
          </h3>
          <div className="pb-5 w-12/12 pt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:text-large text-white md:mb-8 gap-4 px-10 flex-1 overflow-y-scroll">
            {entitiesListedByUser.map((entity: Entity) => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                onSelect={() => handleSelectEntity(entity.tokenId)}
              />
            ))}
          </div>
          <div className="w-2/12 flex flex-col justify-center gap-3 pb-5">
            <Button
              bg="#023340"
              variant="blue"
              text="Back to Wallet"
              onClick={() => setCurrentStep(1)}
            />
          </div>
        </div>
      )}
      {currentStep === 3 && selectedForUnlisting && (
        <div className="w-full justify-center flex flex-col h-[80vh] pt-3 md:px-[100px] rounded-[20px] items-center">
          <div className="mt-3 mb-4 px-2 xl:px-4">
            <EntityCard
              entity={selectedForUnlisting}
              onSelect={() => handleSelectEntity(selectedForUnlisting.tokenId)}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-3 pb-3 mt-5">
            {isLoading ? (
              <LoadingSpinner color="#FF5F1F" />
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
    </Modal>
  );
};
