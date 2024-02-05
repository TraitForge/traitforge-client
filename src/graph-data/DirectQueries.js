import { gql } from '@apollo/client';
import client from './GraphClient';

const GET_ENTITIES_QUERY = gql`
  query GetEntities {
    entities {
      id
      name
      metadataUri
      owner
    }
  }
`;

client.query({
  query: GET_ENTITIES_QUERY
})
.then(response => {
  console.log(response.data.entities);
})
.catch(error => {
  console.error("Error fetching entities:", error);
});
  