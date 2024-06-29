import Image from 'next/image';
import { FaWallet } from 'react-icons/fa';
import { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Button, EntityCard, Modal } from '~/components';
import { BorderType, Entity } from '~/types';
import { shortenAddress } from '~/utils';
import { useAccount } from 'wagmi';
import { useListedEntitiesByUser, useOwnerEntities } from '~/hooks';

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
  const { asPath } = useRouter();
  const { address } = useAccount();
  const { data: ownerEntities } = useOwnerEntities(address || '0x0');
  const { data: entitiesListedByUser } = useListedEntitiesByUser(
    address || '0x0'
  );

  const [selectedForUnlisting, setSelectedForUnlisting] = useState<number[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState(1);

  const shortAddress = address ? shortenAddress(address) : 'Not connected';

  const handleSelectEntity = (tokenId: number) => {
    setSelectedForUnlisting(prevSelected => {
      if (prevSelected.includes(tokenId)) {
        return prevSelected.filter(id => id !== tokenId);
      } else {
        return [...prevSelected, tokenId];
      }
    });
  };

  const containerClasses = classNames(
    'bg-dark-81 flex justify-center items-center border-[5px] rounded-xl max-w-[90%]',
    {
      'border-neon-orange': asPath === '/forging',
      'border-neon-green': asPath === '/trading',
      'border-neon-purple': asPath === '/nuke-fund',
      'border-neon-green-yellow': asPath === '/stats',
      'border-primary': asPath === '/',
    }
  );

  let borderType;
  let buttonColor;

  switch (asPath) {
    case '/forging':
      borderType = BorderType.ORANGE;
      buttonColor = '#FD8D26';
      break;
    case '/trading':
      borderType = BorderType.GREEN;
      buttonColor = '#0EEB81';
      break;
    case '/nuke-fund':
      borderType = BorderType.PURPLE;
      buttonColor = '#FC62FF';
      break;
    default:
      borderType = BorderType.BLUE;
      buttonColor = '#0ADFDB';
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      containerClass={containerClasses}
    >
      {currentStep === 1 && (
        <div className="flex items-center flex-col justify-center h-[80vh]">
          <div className="flex items-center justify-around mt-14 px-[150px] md:pb-[36px] gap-x-[50px]">
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
                <p className="text-neutral-100 text-base">ETH</p>
                <span className="text-white text-large">{balanceInETH}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-2.5">
              <span className="rounded-full w-[46px] flex justify-center items-center h-[46px] bg-[rgba(14,235,129,0.39)]">
                <FaWallet color="#0EEB81" />
              </span>
              <div>
                <p className="text-neutral-100 text-base">Wallet Address</p>
                <span className="text-white text-large">{shortAddress}</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 mx-auto flex justify-center">
            <Button
              bg="#023340"
              borderColor={buttonColor}
              text="Unlist an Entity"
              style={{ marginBottom: '40px' }}
              onClick={() => setCurrentStep(2)}
            />
          </div>
          {ownerEntities.length > 0 && (
            <div className="pb-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 md:text-large text-white md:mb-8 gap-4 px-10 flex-1 overflow-y-scroll">
              {ownerEntities.map((entity: Entity) => (
                <EntityCard
                  key={entity.tokenId}
                  entity={entity}
                  borderType={borderType}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex justify-center items-center flex-col min-w-[40vw]">
          <h3 className="pt-10 text-[18px] md:text-[36px] pb-3">Unlist</h3>
          <Image
            src={'/images/border-bottom-line.png'}
            width={300}
            height={5}
            alt=""
            className="md:mb-[53px]"
          />
          <div className="overflow-x-scroll w-6/12 h-44 flex flex-row md:text-large text-white md:mb-5">
            {entitiesListedByUser.map((entity: Entity) => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                onSelect={() => handleSelectEntity(entity.tokenId)}
                borderType={BorderType.BLUE}
              />
            ))}
          </div>
          <div className="w-2/12 flex flex-col justify-center gap-3 pb-5">
            <Button
              bg="#023340"
              borderColor={buttonColor}
              text="unlist entity"
            />
            <Button
              bg="#023340"
              borderColor="#0ADFDB"
              text="Back to Wallet"
              onClick={() => setCurrentStep(1)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
