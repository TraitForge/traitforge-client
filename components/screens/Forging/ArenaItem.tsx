import classNames from 'classnames';

import { EntityCard } from '~/components';
import { Entity } from '~/types';
import { icons } from '~/components/icons';

type ArenaItemTypes = {
  handleOwnerEntityList?: () => void;
  selectedFromWallet: Entity | null;
  btnLabel?: string;
  className?: string;
};

export const ArenaItem = ({
  handleOwnerEntityList,
  selectedFromWallet,
  btnLabel,
  className,
}: ArenaItemTypes) => {
  if (selectedFromWallet)
    return (
      <EntityCard
        entity={selectedFromWallet}
        onSelect={handleOwnerEntityList}
      />
    );

  const buttonWrapper = classNames(
    'h-[300px] md:h-[400px] border font-bebas text-[28px] md:text-[36px] bg-opacity-60 shadow-custom-forge uppercase border-neon-orange rounded-[20px] py-5 bg-gradient-to-bl from-light-orange to-dark px-5 3xl:px-10 flex flex-col items-center justify-center',
    className
  );

  return (
    <button
      aria-label={btnLabel}
      className={buttonWrapper}
      onClick={handleOwnerEntityList}
    >
      {btnLabel}
      {icons.plus()}
    </button>
  );
};
