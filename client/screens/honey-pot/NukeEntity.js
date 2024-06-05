import { EntityCard, Button } from '@/components';

export const NukeEntity = ({ selectedForNuke, nukeEntity, handleStep }) => {
  return (
    <div className="md:bg-dark-81 w-full md:w-1/2 mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center">
      <div className="max-md:order-1 py-3">
        <EntityCard entity={selectedForNuke} borderType="purple" />
      </div>
      <div className="max-md:order-3 max-md:px-10">
        <Button
          borderColor="#9457EB"
          bg="rba(148, 87, 235, 0.8)"
          text="Nuke"
          onClick={() => {
            nukeEntity(selectedForNuke);
            handleStep('one');
          }}
        />
      </div>
    </div>
  );
};
