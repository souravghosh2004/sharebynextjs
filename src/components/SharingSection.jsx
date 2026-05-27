"use client"; // 🚀 Required for onClick events and Next.js routing hooks

import React from "react";
import { useRouter } from "next/navigation"; // Replaces react-router-dom
import styles from "./SharingSection.module.css";

const SharingSection = () => {
  // 🔹 NEXT.JS ROUTER
  const router = useRouter();

  const navigateUploadFile = () => {
    router.push("/send-files"); // Replaces navigate()
  };

  const navigateStoreTextFile = () => {
    router.push("/send-text"); // Replaces navigate()
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Ready to Start Sharing?</h2>
      <p className={styles.subheading}>
        Join thousands of users who trust ShareFiles for their file sharing needs.
      </p>
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.primaryButton}`} onClick={navigateUploadFile}>
          Upload Your First File
        </button>
        <button className={`${styles.button} ${styles.secondaryButton}`} onClick={navigateStoreTextFile}>
          Share Text
        </button>
      </div>
    </div>
  );
};

export default SharingSection;