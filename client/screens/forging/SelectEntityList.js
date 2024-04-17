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
    <div className="bg-dark-81 w-[80vw] h-[85vh] 2xl:w-[70vw] rounded-[30px] py-10 px-5">
      <div className="border-b border-white">
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
      <div className="grid grid-cols-5 gap-4">
        {filteredEntities.map((entity, index) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            index={index}
            onClick={() => handleSelectedFromPool(entity)}
          />
        ))}
      </div>
    </div>
  );
};

