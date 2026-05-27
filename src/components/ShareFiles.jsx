"use client"; // 🚀 Required for onClick events and Next.js routing

import React from "react";
import { useRouter } from "next/navigation"; // Replaces react-router-dom
import styles from "./ShareFiles.module.css";

const ShareFiles = () => {
  // 🔹 NEXT.JS ROUTER
  const router = useRouter(); 

  return (
    <>
      {/* HERO SECTION */}
      <section className={styles.hero} aria-labelledby="shareby-hero-title">
        <div className={styles.container}>
          <h1 id="shareby-hero-title">
            Share Files{" "}
            <span className={styles.secure}>Securely</span> Without Login
          </h1>

          <p className={styles.heroText}>
            ShareBy is a fast and simple file sharing website that lets you
            upload files or text and share them instantly using a secure
            6-digit code. No login, no signup, and no app installation required.
          </p>

          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryBtn}
              onClick={() => router.push("/send-files")} // 🔹 Replaced navigate()
            >
              Start Sharing Now
            </button>

            <button
              className={styles.outlineBtn}
              onClick={() => router.push("/dashboard")} // 🔹 Replaced navigate()
            >
              View My Files
            </button>
          </div>
        </div>
      </section>

      {/* TRUST / FEATURES STATS */}
      <section className={styles.stats} aria-label="ShareBy features overview">
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>100%</h3>
            <p>No Login Required</p>
          </div>

          <div className={styles.stat}>
            <h3>6-Digit</h3>
            <p>Secure Share Code</p>
          </div>

          <div className={styles.stat}>
            <h3>Instant</h3>
            <p>Upload & Access</p>
          </div>

          <div className={styles.stat}>
            <h3>Private</h3>
            <p>Temporary File Storage</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShareFiles;