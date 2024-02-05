import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ENTITIES_FOR_SALE = gql`
  query GetEntitiesForSale {
    entitiesForSale {
      id
      generation
      name
      owner
      gender
      claimShare
      breedPotential
      age
    }
  }
`;

const GET_ENTITIES_FOR_BREED = gql`
  query GetEntitiesForBreed {
    entitiesForBreed {
      id
      generation
      name
      owner
      gender
      claimShare
      breedPotential
      age
    }
  }
`;

const GET_ENTITIES_FROM_WALLET = gql`
  query GetEntitiesFromWallet {
    entitiesFromWallet (where: {owner: {userWallet}}){
      id
      generation
      name
      owner
      gender
      claimShare
      breedPotential
      age
    }
  }
`;

const EntitiesContext = createContext();

export const useEntities = () => useContext(EntitiesContext);

export const EntitiesProvider = ({ children }) => {
  const [combinedData, setCombinedData] = useState({
    entitiesForSale: [],
    entitiesForBreed: [],
    entitiesFromWallet: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saleQuery = useQuery(GET_ENTITIES_FOR_SALE);
  const breedQuery = useQuery(GET_ENTITIES_FOR_BREED);
  const walletQuery = useQuery(GET_ENTITIES_FROM_WALLET);

  useEffect(() => {
    const anyLoading = saleQuery.loading || breedQuery.loading || walletQuery.loading;
    const anyError = saleQuery.error || breedQuery.error || walletQuery.error;

    if (anyLoading) {
      setLoading(true);
    } else if (anyError) {
      setError(anyError);
    } else {
      setCombinedData({
        entitiesForSale: saleQuery.data?.entitiesForSale || [],
        entitiesForBreed: breedQuery.data?.entitiesForBreed || [],
        entitiesFromWallet: walletQuery.data?.entitiesFromWallet || [],
      });
      setLoading(false);
    }
  }, [saleQuery, breedQuery, walletQuery]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <EntitiesContext.Provider value={combinedData}>
      {children}
    </EntitiesContext.Provider>
  );
};
