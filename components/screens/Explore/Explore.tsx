import { useState } from 'react';

import { LoadingSpinner } from '~/components';
import { Pagination } from '.';
import { ExploreTable } from './ExploreTable';

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
  loading: boolean;
}

const numberPerPage = 10;

export const Explore = ({ users, loading }: Props) => {
  const [page, setPage] = useState(0);
  const numOfPages = Math.ceil(users?.length / numberPerPage);

  const handlePage = (page: number) => setPage(page);

  return (
    <section className="container">
      {loading ? (
        <div className="min-h-[500px] w-full flex justify-center items-center flex-col">
          <LoadingSpinner color="#AAFF3E" />
        </div>
      ) : (
        <>
          <ExploreTable
            numberPerPage={numberPerPage}
            users={users}
            page={page}
          />
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
