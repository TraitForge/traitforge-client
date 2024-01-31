client.query({
    query: gql`
      query GetEntities {
        entities {
          id
          ... // other entity fields
        }
      }
    `
  }).then(data => console.log(data))
    .catch(error => console.error(error));
  