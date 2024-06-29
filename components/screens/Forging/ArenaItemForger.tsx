import Image from 'next/image';
import classNames from 'classnames';
import { EntityCard } from '~/components';
import { BorderType, EntityForging } from '~/types';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { icons } from '~/components/icons';

type ArenaItemForgerTypes = {
  handleEntityListModal?: () => void;
  image: string | StaticImport;
  selectedFromPool: EntityForging | null;
  btnLabel?: string;
  className?: string;
};

export const ArenaItemForger = ({
  handleEntityListModal,
  image,
  selectedFromPool,
  btnLabel,
  className,
}: ArenaItemForgerTypes) => {
  if (selectedFromPool)
    return (
      <EntityCard entity={selectedFromPool} borderType={BorderType.ORANGE} />
    );

  const buttonWrapper = classNames('flex flex-col gap-y-5', className);

  return (
    <div className={buttonWrapper}>
      <button
        aria-label={btnLabel}
        className="items-center justify-center cursor-pointer h-auto relative"
        onClick={handleEntityListModal}
      >
        <Image
          src={image}
          alt="forge place holder"
          width={700}
          height={800}
          className="w-full h-full hidden md:block"
        />
        <div className="hidden md:flex flex-col items-center absolute top-1/2 left-1/2 w-[80%] uppercase font-bebas -translate-x-1/2 -translate-y-1/2">
          <span className="font-bebas">{btnLabel}</span>
          {icons.plus()}
        </div>
        <Image
          src="/images/poolSelectedCardSm.png"
          alt="forge place holder"
          width={600}
          height={600}
          className="w-full h-full block md:hidden"
        />
      </button>
    </div>
  );
};
