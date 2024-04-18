import { EntityCard } from '@/components';

//  TODO: remove this component latter
export const WalletEntityModal = ({ ownerEntities }) => {
  return (
    <div className="flex flex-col justify-center items-center min-w-[400px] min-h-[400px]">
      <h1 className="mb-10 text-large">Select entity</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard entity={entity} index={index} />
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
    </div>
  );
};
