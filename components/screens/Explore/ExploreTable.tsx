import { useState } from 'react';

import { LoadingSpinner } from '~/components';
import { Pagination } from '.';
import { ExploreTableItem } from './ExploreTableItem';

interface Props {
  users: {
    id: number;
    name: string;
    pfp: string;
    twitter: string;
    walletAddress: `0x${string}`;
  }[];
  loading: boolean;
}

const numberPerPage = 10;

export const ExploreTable = ({ users, loading }: Props) => {
  const [page, setPage] = useState(0);

  const numOfPages = Math.ceil(users.length / numberPerPage);

  const handlePage = (page: number) => setPage(page);

  return (
    <section className="container">
      {loading ? (
        <div className="h-[500px] w-full flex justify-center items-center flex-col">
          <LoadingSpinner color="#AAFF3E" />
        </div>
      ) : (
        <>
          <div className="min-h-[631px]">
            <div className="w-full overflow-y-auto ">
              <ul className="grid w-full grid-cols-12">
                <li className="col-span-1 text-left">Id</li>
                <li className="col-span-8 md:col-span-5 text-left">Name</li>
                <li className="col-span-3">Twiter</li>
                <li className="col-span-3 hidden md:block">Address</li>
              </ul>
              <ul className="flex flex-col gap-y-2 mt-10">
                {users
                  .slice(page * numberPerPage, (page + 1) * numberPerPage)
                  .map(item => (
                    <ExploreTableItem key={item.id} {...item} />
                  ))}
              </ul>
            </div>
          </div>
          <Pagination
            numOfPages={numOfPages}
            handlePage={handlePage}
            page={page}
          />
        </>
      )}
    </section>
  );
};
