import { EntityCard, Button } from '~/components';
import { Entity } from '~/types';

type NukeEntityTypes = {
  selectedForNuke: Entity;
  nukeEntity: () => void;
  handleStep: (value: string) => void;
};

export const NukeEntity = ({
  selectedForNuke,
  nukeEntity,
  handleStep,
}: NukeEntityTypes) => {
  return (
    <div className="md:bg-dark-81 w-full md:w-[60%] xl:w-[40%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-1 py-3">
        <EntityCard entity={selectedForNuke} />
      </div>
      <p className="text-base">
        Enity cannot be nuked if acquired less then 3 days ago.
      </p>
      <div className="max-md:order-3 max-md:px-10 mt-5">
        <Button
          bg="rba(148, 87, 235, 0.8)"
          text="Nuke"
          variant='purple'
          onClick={() => {
            nukeEntity();
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
