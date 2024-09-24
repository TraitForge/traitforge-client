import { ExploreTableItem } from './ExploreTableItem';

interface Props {
  users: {
    id: number;
    name: string;
    pfp: string;
    twitter: string;
    walletAddress: `0x${string}`;
    entities: {
      entropy: number;
      id: number;
      userId: number;
    }[];
  }[];
  page: number;
  numberPerPage: number;
}

export const ExploreTable = ({ users, page, numberPerPage }: Props) => {
  return (
    <div className="min-h-[631px]">
      <div className="w-full overflow-y-auto ">
        <ul className="grid w-full grid-cols-12">
          <li className="col-span-2 text-left">Entities owned</li>
          <li className="col-span-6 text-left">Name</li>
          <li className="col-span-4 text-right">Twitter/X</li>
        </ul>
        <ul className="flex flex-col gap-y-4 mt-5">
          {users
            .slice(page * numberPerPage, (page + 1) * numberPerPage)
            .map(item => (
              <ExploreTableItem key={item.id} {...item} />
            ))}
        </ul>
      </div>
    </div>
  );
};
