import React from 'react';
import ReactDOM from 'react-dom/client';
import { Web3Provider } from './utils/Web3Context'; 
import App from '/Users/hudsondungey/TFCREAM/updatedrepo/src/components/App.js';
import { ApolloProvider } from '@apollo/client';
import client from './graph-data/GraphClient';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
  <Web3Provider>
    <App />
  </Web3Provider>,
  </ApolloProvider>,
);


