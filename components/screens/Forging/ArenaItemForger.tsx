import classNames from 'classnames';

import { EntityCard } from '~/components';
import { EntityForging } from '~/types';
import { icons } from '~/components/icons';

type ArenaItemForgerTypes = {
  handleEntityListModal?: () => void;
  selectedFromPool: EntityForging | null;
  btnLabel?: string;
  className?: string;
};

export const ArenaItemForger = ({
  handleEntityListModal,
  selectedFromPool,
  btnLabel,
  className,
}: ArenaItemForgerTypes) => {
  if (selectedFromPool)
    return (
      <EntityCard entity={selectedFromPool} onSelect={handleEntityListModal} />
    );

  const buttonWrapper = classNames(
    'h-[300px] md:h-[400px] overflow-hidden border font-bebas text-[28px] md:text-[36px]  bg-opacity-60 shadow-custom-forge uppercase border-neon-orange rounded-[20px] py-5 bg-gradient-to-bl from-light-orange to-dark px-5 3xl:px-10 flex flex-col items-center justify-center',
    className
  );

  return (
    <button
      aria-label={btnLabel}
      className={buttonWrapper}
      onClick={handleEntityListModal}
    >
      {btnLabel}
      {icons.plus()}
    </button>
  );
};
