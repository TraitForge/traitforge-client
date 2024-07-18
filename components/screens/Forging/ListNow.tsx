import { useState } from 'react';
import { EntityCard, Button } from '~/components';
import { ListingHeader } from './ListingHeader';
import { Entity } from '~/types';

type ListNowTypes = {
  selectedForListing: Entity;
  listEntityForForging: (entity: Entity, fee: string) => void;
  handleStep: (value: string) => void;
};

export const ListNow = ({
  selectedForListing,
  listEntityForForging,
  handleStep,
}: ListNowTypes) => {
  const [fee, setFee] = useState('');
  const [showFeeError, setShowFeeError] = useState(false);

  return (
    <div className="h-full w-full">
      <div className="container w-screen pt-5 flex flex-col h-full">
        <ListingHeader handleStep={handleStep} step="three" />
        <div className=" md:bg-dark-81 w-full md:w-[60%] xl:w-[40%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[70px] lg:px-[100px] flex flex-col rounded-[20px] items-center">
          <div className="max-md:order-2 w-full">
            <h3 className="text-large font-electrolize mb-2">
              Set a fee for your forger:
            </h3>
            <p className="text-sm mb-2 uppercase text-neutral-100">
              min fee is 0.01 ETH
            </p>
            <input
              className="border w-full border-neon-orange bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
              type="number"
              placeholder="Enter fee in ETH"
              value={fee}
              onChange={e => setFee(e.target.value)}
              min={0.01}
            />
            {showFeeError && (
              <p className="text-left text-sm py-1 text-red-600">
                Please add fee in eth
              </p>
            )}
          </div>
          <div className="max-md:order-1 py-4">
            <EntityCard entity={selectedForListing} />
          </div>
          <div className="max-md:order-3 max-md:px-10 mt-5">
            <Button
              bg="rgba(24, 12, 0,0.7)"
              text="List for Forging"
              variant="orange"
              onClick={() => {
                if (fee !== '') {
                  listEntityForForging(selectedForListing, fee);
                  handleStep('one');
                } else {
                  setShowFeeError(true);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
