import Image from 'next/image';
import classNames from 'classnames';
import { EntityCard } from '~/components';
import { BorderType, Entity } from '~/types';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { icons } from '~/components/icons';

type ArenaItemTypes = {
  handleOwnerEntityList?: () => void;
  image: string | StaticImport;
  selectedFromWallet: Entity | null;
  btnLabel?: string;
  className?: string;
};

export const ArenaItem = ({
  handleOwnerEntityList,
  image,
  selectedFromWallet,
  btnLabel,
  className,
}: ArenaItemTypes) => {
  if (selectedFromWallet)
    return (
      <EntityCard entity={selectedFromWallet} borderType={BorderType.ORANGE} />
    );

  const buttonWrapper = classNames('flex flex-col gap-y-5', className);

  return (
    <div className={buttonWrapper}>
      <button
        aria-label={btnLabel}
        className="items-center justify-center cursor-pointer h-auto relative"
        onClick={handleOwnerEntityList}
      >
        <Image
          src={image}
          alt="forge place holder"
          width={700}
          height={700}
          className="w-full h-full hidden md:block"
        />
        <div className="hidden md:flex flex-col items-center absolute top-1/2 left-1/2 w-[80%] uppercase -translate-x-1/2 -translate-y-1/2">
          <span className='font-bebas'>{btnLabel}</span>
          {icons.plus()}
        </div>{' '}
        <Image
          src="/images/walletSelectCardSm.png"
          alt="forge place holder"
          width={600}
          height={600}
          className="w-full h-full block md:hidden"
        />
      </button>
    </div>
  );
};
