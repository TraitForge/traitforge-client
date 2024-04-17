import classNames from 'classnames';
import Select from 'react-select';

export const FiltersHeader = ({
  handleSort,
  sortOption,
  color,
  handleFilterChange,
  generationFilter
}) => {
  const commonClasses = "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px]";
  const activeClasses = classNames(commonClasses, {
    'after:bg-neon-orange': color === 'orange',
    'after:bg-neon-green': color === 'green',
  });

  const options = [
    { value: '', label: 'All Generations' },
    ...Array.from({ length: 10 }, (_, index) => ({
      value: index + 1,
      label: `Gen ${index + 1}`
    }))
  ];

  const borderColor = color === 'orange' ? '#ff7a00' : color === 'green' ? '#4CAF50' : '#ccc';
  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      fontSize: '18px',
      color: 'white',
      borderColor: borderColor,
      boxShadow: 'none',
      '&:hover': {
        borderColor: borderColor
      }
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, ${})',
      boxShadow: `0px 0px 1px 1px ${borderColor}`
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 1)'
      }
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'white',
    })
  };


  return (
    <div className="flex w-full items-center uppercase gap-x-6 pt-6 text-[24px]">
      {['all', 'forgers', 'mergers'].map(type => (
        <button
          key={type}
          className={`${sortOption === type ? activeClasses : ''} relative px-6 pb-3`}
          onClick={() => handleSort(type)}
        >
          {type}
        </button>
      ))}
      <div className="flex-1"> 
        <div className="flex gap-x-6 text-[20px] justify-end">
          <Select 
            options={options}
            onChange={handleFilterChange}
            value={options.find(option => option.value === generationFilter)}
            styles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};