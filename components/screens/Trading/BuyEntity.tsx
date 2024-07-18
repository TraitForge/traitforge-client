import { EntityCard, Button } from '~/components';
import { EntityTrading } from '~/types';

type BuyEntityTypes = {
  selectedListing: EntityTrading;
  buyEntity: () => void;
  handleStep: (value: string) => void;
};

export const BuyEntity = ({
  selectedListing,
  buyEntity,
  handleStep,
}: BuyEntityTypes) => {
  return (
    <div className="md:bg-green w-full md:w-[60%] xl:w-[40%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[50px] xl:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-1 py-5">
        <EntityCard
          entity={selectedListing}
          showPrice={!!selectedListing.price}
          displayPrice={selectedListing.price}
        />
      </div>
      <div className="max-md:order-3 max-md:px-10 mt-3">
        <Button
          bg="rba(8, 30, 14,0.8)"
          text="Buy Now"
          variant="green"
          onClick={() => {
            buyEntity();
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
