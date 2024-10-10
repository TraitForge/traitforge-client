'use client';

import classNames from 'classnames';
import Select, { CSSObjectWithLabel, SingleValue } from 'react-select';

type FiltersHeaderTypes = {
  handleSort?: (value: string) => void;
  sortOption?: string;
  color: string;
  handleFilterChange: (
    option: SingleValue<
      | {
          value: number;
          label: string;
        }
      | {
          value: string;
          label: string;
        }
    >,
    generation: string
  ) => void;
  generationFilter: string | number;
  sortingFilter: string | number;
  hideSortingSelect?: boolean;
  filterOptions?: string[];
  pageType?: string;
};

export const FiltersHeader = ({
  handleSort,
  sortOption,
  color,
  handleFilterChange,
  generationFilter,
  sortingFilter,
  hideSortingSelect,
  filterOptions = ['all', 'forgers', 'mergers'],
  pageType, // Add this prop to determine which sorting options to display
}: FiltersHeaderTypes) => {
  const commonClasses =
    'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px]';
  const activeClasses = classNames(commonClasses, {
    'after:bg-neon-orange': color === 'orange',
    'after:bg-neon-green': color === 'green',
    'after:bg-neon-purple': color === 'purple',
  });

  const genOptions = [
    { value: 0, label: 'All Gens' },
    ...Array.from({ length: 10 }, (_, index) => ({
      value: index + 1,
      label: `Gen ${index + 1}`,
    })),
  ];

  const sortingOptions = [
    { value: '', label: 'All' },
    { value: 'price_high_to_low', label: 'Price: High to Low' },
    { value: 'price_low_to_high', label: 'Price: Low to High' },
  ];

  const nukeSortingOptions = [
    { value: '', label: 'All' },
    { value: 'NukeFactor_high_to_low', label: 'NukeFactor: High to Low' },
    { value: 'NukeFactor_low_to_high', label: 'NukeFactor: Low to High' },
  ];

  const borderColor =
    color === 'orange'
      ? '#ff7a00'
      : color === 'green'
        ? '#4CAF50'
        : color === 'purple'
          ? '#B026FF'
          : '#ccc';
  const customStyles = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      fontSize: '18px',
      color: 'white',
      borderColor: borderColor,
      boxShadow: 'none',
      '&:hover': {
        borderColor: borderColor,
      },
    }),
    menu: (styles: CSSObjectWithLabel) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      boxShadow: `0px 0px 1px 1px ${borderColor}`,
      minWidth: '220px',
      right: 0,
      zIndex: 100,
    }),
    option: (styles: CSSObjectWithLabel) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 1)',
      },
      whiteSpace: 'nowrap',
    }),
    singleValue: (styles: CSSObjectWithLabel) => ({
      ...styles,
      color: 'white',
    }),
  };

  return (
    <div className="flex items-center flex-wrap w-full uppercase pt-6 z-50 justify-between mb-3 max-md:gap-3">
      <div className="flex gap-x-2 md:gap-x-6 text-[24px]">
        {filterOptions.map(type => (
          <button
            key={type}
            className={`${
              sortOption === type ? activeClasses : ''
            } relative px-3 md:px-6 pb-2 font-bebas`}
            onClick={() => {
              if (color !== 'orange' && handleSort) {
                handleSort(type);
              }
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex gap-x-3 md:gap-x-6 text-[20px] justify-end font-bebas">
        <Select
          options={genOptions}
          onChange={option => handleFilterChange(option, 'generation')}
          value={genOptions.find(
            option => option.value === Number(generationFilter)
          )}
          styles={{
            ...customStyles,
            menu: styles => ({
              ...styles,
              minWidth: '100px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              boxShadow: `0px 0px 1px 1px ${borderColor}`,
              zIndex: 100,
            }),
          }}
        />
        {!hideSortingSelect && (
          <Select
            options={pageType === 'nuke' ? nukeSortingOptions : sortingOptions}
            onChange={option => handleFilterChange(option, 'sorting')}
            value={(pageType === 'nuke'
              ? nukeSortingOptions
              : sortingOptions
            ).find(option => option.value === sortingFilter)}
            styles={{
              ...customStyles,
              menu: styles => ({
                ...styles,
                minWidth: '220px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                boxShadow: `0px 0px 1px 1px ${borderColor}`,
                zIndex: 100,
                right:0
              }),
            }}
          />
        )}
      </div>
    </div>
  );
};
