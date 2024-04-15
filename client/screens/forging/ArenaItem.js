import Image from 'next/image';

import { EntityCard } from '@/components';

export const ArenaItem = ({
  handleEntityListModal,
  image,
  selectedFromPool,
  selectedFromWallet,
}) => {
  if (selectedFromPool || selectedFromWallet)
    return <EntityCard entity={selectedFromPool} borderType="orange" />;

  return (
    <div
      className="flex items-center justify-center cursor-pointer h-full"
      onClick={handleEntityListModal}
    >
      <Image
        src={image}
        alt="forge place holder"
        width={400}
        height={500}
        className="w-full h-full"
      />
    </div>
  );
};
