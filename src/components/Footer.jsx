import React from "react";
import Link from "next/link"; // 🚀 Replaces react-router-dom
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Brand / About */}
        <div className={styles.left}>
          <div className={styles.logoContainer}>
            <span className={styles.logoText}>ShareBy</span>
          </div>

          <p className={styles.description}>
            Securely <strong>send files and text</strong> instantly with ShareBy.
            Our platform allows for <strong>anonymous file sharing without login</strong> or app installation.
            Just upload to generate a unique code and access your data across mobile, desktop, and tablets in seconds.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className={styles.links} aria-label="Footer navigation">
          <div>
            <h4 className={styles.heading}>Product</h4>
            <ul>
              {/* 🔹 Changed 'to' to 'href' for Next.js Links */}
              <li><Link href="/send-files">Upload Files</Link></li>
              <li><Link href="/receive-files">Access Files</Link></li>
              <li><Link href="/send-text">Share Text</Link></li>
              <li><Link href="/receive-text">Receive Text</Link></li>
              <li><Link href="/dashboard">My Files</Link></li>
              <li><Link href="/features">Features</Link></li>

              {/* ✅ GitHub Showcase Link */}
              <li>
                <a
                  href="https://github.com/souravghosh2004/shareby-showcase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.heading}>Support</h4>
            <ul>
              {/* 🔹 Changed 'to' to 'href' for Next.js Links */}
              <li><Link href="/about">About</Link></li>
              <li><Link href="/help-center">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p className={styles.rights}>
          © {new Date().getFullYear()} ShareBy. All rights reserved.
        </p>

        <p className={styles.version}>
          Version 2.0.0 · Built with ❤️ by{" "}
          <a
            href="https://souravghosh2004.github.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
            title="Developer"
          >
            Sourav Ghosh
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;