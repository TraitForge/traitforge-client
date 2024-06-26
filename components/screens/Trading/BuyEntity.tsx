import { EntityCard, Button } from '~/components';
import { BorderType, EntityTrading } from '~/types';

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
    <div className="md:bg-dark-81 w-full md:w-1/2 cl:w-[60%] mx-auto pt-10 pb-[50px] md:px-[50px] xl:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-1">
        <EntityCard
          entity={selectedListing}
          borderType={BorderType.GREEN}
          showPrice={!!selectedListing.price}
        />
      </div>
      <div className="max-md:order-3 max-md:px-10 mt-3">
        <Button
          borderColor="#0EEB81"
          bg="rba(8, 30, 14,0.8)"
          text="Buy Now"
          onClick={() => {
            buyEntity();
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
