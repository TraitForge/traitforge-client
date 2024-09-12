'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { ExploreHeading, Explore } from '~/components/screens';

export interface User {
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
}

export interface SearchResults {
  twitter: User[];
  users: User[];
  walletAddress: User[];
}

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setTableLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = (text: string) => setSearchQuery(text);

  const searchUsers = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/users?name=${searchQuery}`);
      setSearchResults(data);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = _.debounce(searchUsers, 500);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
      return () => {
        debouncedSearch.cancel();
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
      await searchUsers('')
        .then(res => setUsers(res.walletAddress))
        .catch(error => console.log(error))
        .finally(() => {
          setTableLoading(false);
        });
    };
    fetchData();
  }, []);

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
        results={results as SearchResults}
        loading={loading}
      />
      <Explore users={users as User[]} loading={isLoading} />
    </div>
  );
};

export default ExplorePage;
