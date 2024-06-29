import { EntityCard, Button } from '~/components';
import { BorderType, Entity } from '~/types';

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
    <div className="md:bg-dark-81 w-full md:w-1/2 mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-1 py-3">
        <EntityCard entity={selectedForNuke} borderType={BorderType.PURPLE} />
      </div>
      <p className="text-base">
        Enity cannot be nuked if acquired less then 3 days ago.
      </p>
      <div className="max-md:order-3 max-md:px-10 mt-5">
        <Button
          borderColor="#FC62FF"
          bg="rba(148, 87, 235, 0.8)"
          text="Nuke"
          onClick={() => {
            nukeEntity();
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
