import styles from '@/styles/forging.module.scss';

export const SelectEntityList = ({
  sortedEntities,
  handleSelectedFromPool,
}) => {
  return (
    <div className={styles.entityListContainer}>
      <div className="border-b border-white">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select entity
        </h3>
        <div>
          tabs goes here
        </div>
      </div>
      {sortedEntities.map((entity, index) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          index={index}
          onClick={() => handleSelectedFromPool(entity)}
        />
      ))}
    </div>
  );
};
