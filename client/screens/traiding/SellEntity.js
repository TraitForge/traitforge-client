import { EntityCard, Button } from '@/components';

import styles from '@/styles/trading.module.scss';

export const SellEntity = ({ selectedForSale }) => {
  return (
    <div className="bg-dark-81 w-1/2 mx-auto pt-10 pb-[50px] px-[100px] flex flex-col rounded-[20px] items-center">
      <h3 className="text-large font-electrolize mb-8">
        Set a price for your entity:
      </h3>
      <input
        className="border w-full mb-[44px] border-neon-green bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
        type="number"
        placeholder="Enter price in ETH"
      />
      {/* <EntityCard key={selectedForSale?.tokenId} entity={selectedForSale} /> */}
      <Button
        borderColor="#0EEB81"
        bg="rba(8, 30, 14,0.8)"
        text="List for Sale"
        onClick={() => {}}
      />
      {/* <img
          src="/images/sellButton.png"
          alt="sell place holder"
          onClick={() => listEntityForSale(selectedForSale)}
          disabled={processing}
        /> */}
    </div>
  );
};
