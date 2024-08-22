'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { ExploreHeading, Explore } from '~/components/screens';

interface User {
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
      className="min-h-screen pt-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.7) 49%, rgba(0, 0, 0, 0.7) 100%), url('/images/marketplace-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <ExploreHeading
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        users={users}
      />
      <Explore users={users} loading={loading} />
    </div>
  );
};

export default ExplorePage;
