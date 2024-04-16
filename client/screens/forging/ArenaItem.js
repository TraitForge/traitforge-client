import Image from 'next/image';

import { EntityCard } from '@/components';

export const ArenaItem = ({
  handleEntityListModal,
  image,
  selectedFromPool,
  selectedFromWallet,
  btnLabel,
}) => {
  if (selectedFromPool || selectedFromWallet)
    return <EntityCard entity={selectedFromPool} borderType="orange" />;

  return (
    <button
      aria-label={btnLabel}
      className="flex items-center justify-center cursor-pointer h-auto"
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
