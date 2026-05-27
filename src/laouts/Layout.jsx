//import React from 'react';
import Navbar from '../navbar/Navbar';
//import ShareFiles from '../components/ShareFiles';
//import Footer from '../components/Footer';
const Layout = ({ children }) => {
  return (
   
      <div className="app-mobile-container">
        <Navbar />
        <main className="content">
          {children}
        </main>
      </div>
  );
};

export default Layout;
