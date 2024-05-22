import { useState } from 'react';
import { EntityCard, Button } from '@/components';

import styles from '@/styles/trading.module.scss';

export const SellEntity = ({ selectedForSale, listEntityForSale, handleStep }) => {
  const [price, setPrice] = useState('');
  return (
    <div className="md:bg-dark-81 w-full md:w-1/2 mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-2 w-full">
        <h3 className="text-large font-electrolize mb-8">
          Set a price for your entity:
        </h3>
        <input
          className="border w-full mb-[44px] border-neon-green bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
          type="number"
          placeholder="Enter price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="max-md:order-1">
        <EntityCard 
        borderType='green'
        entity={selectedForSale}
        />
      </div>
      <div className="max-md:order-3 max-md:px-10">
        <Button
          borderColor="#0EEB81"
          bg="rba(8, 30, 14,0.8)"
          text="List for Sale"
          onClick={async () => {
            await listEntityForSale(selectedForSale, price);
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
