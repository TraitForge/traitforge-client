import { useState } from 'react';
import { EntityCard, Button } from '@/components';
import { ListingHeader } from '@/screens/forging/ListingHeader';

export const ListNow = ({
  selectedForListing,
  listEntityForForging,
  handleStep,
}) => {
  const [fee, setFee] = useState('');
  const [showFeeError, setShowFeeError] = useState(false);

  return (
    <div className="h-full w-full">
      <div className="container w-screen pt-10 md:pt-[54px] flex flex-col h-full">
        <ListingHeader handleStep={handleStep} step="three" />
        <div className=" md:bg-dark-81 md:w-[60%] xl:w-1/2 mx-auto pt-10 pb-[50px] md:px-[70px] lg:px-[100px] flex flex-col rounded-[20px] items-center">
          <div className="max-md:order-2 w-full">
            <h3 className="text-large font-electrolize mb-8">
              Set a fee for your forger:
            </h3>
            <input
              className="border w-full border-neon-orange bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
              type="number"
              placeholder="Enter fee in ETH"
              value={fee}
              onChange={e => setFee(e.target.value)}
            />
            {showFeeError && (
              <p className="text-left text-base py-1 text-red-600">
                Enter fee in ETH
              </p>
            )}
          </div>
          <div className="max-md:order-1 py-4">
            <EntityCard borderType="orange" entity={selectedForListing} />
          </div>
          <div className="max-md:order-3 max-md:px-10">
            <Button
              borderColor="#FF5F1F"
              bg="rgba(24, 12, 0,0.7)"
              text="List for Forging"
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
