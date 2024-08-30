import { useState } from 'react';
import { EntityCard, Button } from '~/components';
import { Entity } from '~/types';

type SellEntityTypes = {
  selectedForSale: Entity;
  listEntityForSale: () => void;
  handleStep: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
};

export const SellEntity = ({
  selectedForSale,
  listEntityForSale,
  handleStep,
  price,
  setPrice,
}: SellEntityTypes) => {
  const [showPriceError, setShowPriceError] = useState(false);

  return (
    <div className="md:bg-green max-md:px-5 w-full md:w-[60%] xl:w-[40%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-2 w-full mb-[14px]">
        <h3 className="text-large font-electrolize mb-8 max-md:pt-5">
          Set a price for your entity:
        </h3>
        <input
          className="border w-full  border-neon-green bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
          type="number"
          placeholder="Enter price in ETH"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        {showPriceError && (
          <p className="text-left text-base py-1 text-red-600">
            Enter price in ETH
          </p>
        )}
      </div>
      <div className="max-md:order-1">
        <EntityCard entity={selectedForSale} />
      </div>
      <div className="max-md:order-3 max-md:px-10 mt-4">
        <Button
          bg="rba(8, 30, 14,0.8)"
          text="List for Sale"
          variant='green'
          onClick={async () => {
            if (price !== '') {
              await listEntityForSale();
              handleStep('one');
            } else {
              setShowPriceError(true);
            }
          }}
        />
      </div>
    </div>
  );
};
