import styles from '@/styles/forging.module.scss';

export const SelectEntityList = ({
  sortedEntities,
  handleSelectedFromPool,
}) => {
  
  return (
    <div className={styles.entityListContainer}>
      <div className={styles.breedSortingOptions}>
        <div className={styles.leftItems}>
          <button
            className={styles.breedEntityButton}
            onClick={() => openModalWithContent(modalContentToList)}
          >
            List Your Forger
          </button>
          {/* {isOpen && (
            <Modal background="/images/forge-background.jpg">
              {modalContent}
            </Modal>
          )} */}
        </div>
        <div className={styles.rightItems}>
          <select
            className={styles.forgeSortingDropdown}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="">Select Sorting Option</option>
            <option value="priceLowHigh">Fee: Low to High</option>
            <option value="priceHighLow">Fee: High to Low</option>
          </select>
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
