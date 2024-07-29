'use client';

import { useState } from 'react';

import { ExploreHeading } from '~/components/screens';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => setSearchQuery(text);

  return (
    <div
      className="flex flex-col h-full mb-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/marketplace-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <ExploreHeading searchQuery={searchQuery} handleSearch={handleSearch} />
    </div>
  );
};

export default ExplorePage;
