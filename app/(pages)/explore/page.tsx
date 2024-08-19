'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { ExploreHeading, ExploreTable } from '~/components/screens';
import { LoadingSpinner } from '~/components';

export interface User {
  id: number;
  name: string;
  pfp: string;
  twitter: string;
  walletAddress: `0x${string}`;
}

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (text: string) => setSearchQuery(text);

  const searchUsers = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/users?name=${searchQuery}`);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = _.debounce(searchUsers, 500);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/marketplace-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <ExploreHeading searchQuery={searchQuery} handleSearch={handleSearch} />
      {loading ? (
        <div className="h-full w-full flex justify-center items-center flex-col">
          <LoadingSpinner color="#AAFF3E" />
        </div>
      ) : (
        <ExploreTable users={users} />
      )}
    </div>
  );
};

export default ExplorePage;
