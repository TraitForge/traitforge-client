import { useState } from 'react';
import { EntityCard, Button } from '@/components';
import { ListingHeader } from '@/screens/forging/ListingHeader';

export const ListNow = ({
  selectedForListing,
  ListEntityForForging,
  handleStep,
}) => {
  const [fee, setFee] = useState('');

  return (
    <div className="h-full w-full">
      <div className="container w-screen pt-10 md:pt-[54px] flex flex-col h-full">
        <ListingHeader handleStep={handleStep} step="three" />
        <div className=" md:bg-dark-81 md:w-1/2 mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
          <div className="max-md:order-2 w-full">
            <h3 className="text-large font-electrolize mb-8">
              Set a fee for your forger:
            </h3>
            <input
              className="border w-full mb-[44px] border-neon-orange bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
              type="number"
              placeholder="Enter fee in ETH"
              value={fee}
              onChange={e => setFee(e.target.value)}
            />
          </div>
          <div className="max-md:order-1">
            <EntityCard borderType="orange" entity={selectedForListing} />
          </div>
          <div className="max-md:order-3 max-md:px-10">
            <Button
              borderColor="#FF5F1F"
              bg="rgba(24, 12, 0,0.7)"
              text="List for Forging"
              onClick={() => {
                ListEntityForForging(selectedForListing, fee);
                handleStep('one');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
