import Image from 'next/image';
import classNames from 'classnames';

import { EntityCard } from '@/components';

export const ArenaItem = ({
  handleEntityListModal,
  image,
  selectedFromPool,
  selectedFromWallet,
  btnLabel,
  className,
}) => {
  if (selectedFromPool || selectedFromWallet)
    return <EntityCard entity={selectedFromPool} borderType="orange" />;

  const buttonWrapper = classNames(
    'items-center justify-center cursor-pointer h-auto',
    className
  );

  return (
    <button
      aria-label={btnLabel}
      className={buttonWrapper}
      onClick={handleEntityListModal}
    >
      <Image
        src={image}
        alt="forge place holder"
        width={400}
        height={500}
        className="w-full h-full"
      />
    </button>
  );
};
