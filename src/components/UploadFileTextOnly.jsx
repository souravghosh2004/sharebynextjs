"use client"; // 🚀 Required for onClick events and Next.js routing hooks

import { useRouter } from 'next/navigation'; // Replaces react-router-dom
import styles from "./UploadFileTextOnly.module.css"; 
import { FaRegFileAlt } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
// Note: FaShieldAlt, FaClock, FaGlobe were imported but not used in the UI snippet, keeping them just in case.
import { FaShieldAlt, FaClock, FaGlobe } from "react-icons/fa";

const UploadFileTextOnly = () => {
  // 🔹 NEXT.JS ROUTER
  const router = useRouter();

  // 🔹 Use router.push() instead of navigate()
  const navigateUploadFile = () => router.push("/send-files");
  const navigateAccessFiles = () => router.push("/receive-files");
  const navigateStoreTextFile = () => router.push("/send-text");
  const receiveTextFile = () => router.push("/receive-text");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.homeContainer}>
        <h2 className={styles.mainTitle}>Quick Action</h2>
       
        <p className={styles.subtitle}>Choose what you want to share</p>
        
        <section className={styles.section}>
          <div className={styles.cardContainer}>
            {/* File Share */}
            <div className={styles.card}>
              <div className={`${styles.icon} ${styles.blue}`}>
                <FaRegFileAlt />
              </div>
              {/* ✅ Fixed a small typo here: "Wihtout" -> "Without" */}
              <h2 className={styles.subTitle}>Share Files Without Login</h2>
              <p className={styles.cardText}>Upload any file and get a shareable code</p>
              <div className={styles.buttons}>
                <button
                  className={`${styles.btn} ${styles.primaryBtn}`}
                  onClick={navigateUploadFile}
                >
                  Send Files
                </button>
                <button
                  className={`${styles.btn} ${styles.secondaryBtn}`}
                  onClick={navigateAccessFiles}
                >
                  Receive Files
                </button>
              </div>
            </div>

            {/* Text Share */}
            <div className={styles.card}>
              <div className={`${styles.icon} ${styles.green}`}>
                <FaRegFileLines />
              </div>
              <h2 className={styles.subTitle}>Share Text Without Login</h2>
              <p className={styles.cardText}>Share text snippets with secure codes</p>
              <div className={styles.buttons}>
                <button
                  className={`${styles.btn} ${styles.textBtn}`}
                  onClick={navigateStoreTextFile}
                >
                  Send Text
                </button>
                <button
                  className={`${styles.btn} ${styles.showTextBtn}`}
                  onClick={receiveTextFile}
                >
                  Receive Text
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadFileTextOnly;