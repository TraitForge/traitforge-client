import { useState } from 'react';
import { EntityCard, FiltersHeader } from '@/components'; 

export const SelectEntityList = ({ entitiesForForging, handleSelectedFromPool }) => {
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState(''); 

  const handleSort = type => setSortOption(type);
  const handleFilterChange = selectedOption => setGenerationFilter(selectedOption.value);

  const getFilteredEntities = () => {
    let filteredEntities = entitiesForForging;

    if (generationFilter) {
      filteredEntities = filteredEntities.filter(entity => entity.generation.toString() === generationFilter);
    }

    return filteredEntities;
  };

  const filteredEntities = getFilteredEntities();

  return (
    <div className="bg-dark-81 w-[80vw] h-[85vh] 2xl:w-[70vw] rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select entity
        </h3>
        <FiltersHeader
          sortOption={sortOption}
          handleSort={handleSort}
          color="orange"
          handleFilterChange={handleFilterChange}
          generationFilter={generationFilter}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-5 gap-x-[15px] gap-y-10">
          {sortedEntities?.map((entity, index) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              index={index}
              onClick={() => handleSelectedFromPool(entity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

