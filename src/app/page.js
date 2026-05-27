import React from 'react';
import styles from "./Home.module.css";

import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';
import SharingSection from '../components/SharingSection';
import ShareFiles from '../components/ShareFiles';
import FileSharingFeatures from '../components/FileSharingFeatures';
import UploadFileTextOnly from '../components/UploadFileTextOnly';


const Home = () => {
  return (
    <div className={styles.mainContainer}>

      {/* Core UI Components */}
      <UploadFileTextOnly />
      <ShareFiles />
      <HowItWorks />
      <FileSharingFeatures />
      <SharingSection />
    </div>
  );
};

export default Home;