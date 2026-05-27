import React from "react";
import { FaCloudArrowUp, FaShareNodes, FaDownload } from "react-icons/fa6";
import styles from "./HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <section
      className={styles.container}
      aria-labelledby="how-shareby-works"
    >
      <h2 id="how-shareby-works" className={styles.title}>
        How ShareBy File Sharing Works
      </h2>

      <p className={styles.subtitle}>
        Simple, secure, and fast file sharing without login
      </p>

      {/* SEO Paragraph */}
      <p className={styles.seoText}>
        ShareBy is a fast and secure file sharing website that allows users to
        upload files or text and share them instantly using a 6-digit code.
        No login, no signup, and no app installation required. ShareBy is ideal
        for students, professionals, and anyone who wants to share files online
        quickly and privately.
      </p>

      <div className={styles.steps}>
        {/* Step 1 */}
        <div className={styles.step}>
          <div className={`${styles.icon} ${styles.blue}`}>
            <FaCloudArrowUp />
          </div>
          <h3>Upload Files Online</h3>
          <p>
            Upload your file or text and instantly receive a secure{" "}
            <strong>6-digit sharing code</strong>.
          </p>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={`${styles.icon} ${styles.purple}`}>
            <FaShareNodes />
          </div>
          <h3>Share Files Using Code</h3>
          <p>
            Share the code with anyone you want to give access to your file or
            text securely.
          </p>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={`${styles.icon} ${styles.green}`}>
            <FaDownload />
          </div>
          <h3>Download Without Login</h3>
          <p>
            Anyone can use the code to download files or view text without
            creating an account.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
