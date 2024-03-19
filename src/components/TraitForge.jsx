import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; 

const TraitForge = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default TraitForge;
