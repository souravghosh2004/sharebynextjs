"use client"; // 🚀 Mandatory for state, refs, and browser APIs

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Replaces react-router-dom
import styles from "./StoreText.module.css";
// Adjust API imports based on your new folder structure
import { storeTextAPI } from "../../api/text.api.js";
import {
  FaCopy, FaTrash, FaCheck, FaSave,
  FaMagic, FaDownload, FaUpload, FaFileImport
} from "react-icons/fa";
import Toast from "../../components/Toast.jsx";

// ADVERTISEMENT COMPONENTS (Keep these commented or adjust paths)
// import ResponsiveAd from "../../advertisement/ResponsiveAd.jsx";
// import Adsterra300x250 from "../../advertisement/Adsterra300x250.jsx";

const timeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const StoreTextClient = () => {
  const [content, setContent] = useState("");
  const [toast, setToast] = useState(null);
  const [uniqueCode, setUniqueCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentCodes, setRecentCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState("");
  const [viewLimit, setViewLimit] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");

  // ✅ NEXT.JS FIX: Safe window check for initial state
  const [isDesktop, setIsDesktop] = useState(true);
  const codeBoxRef = useRef(null);

  useEffect(() => {
    // Set initial width safely after component mounts on client
    setIsDesktop(window.innerWidth > 900);

    const handleResize = () => setIsDesktop(window.innerWidth > 900);

    const loadData = () => {
      const stored = JSON.parse(localStorage.getItem("textCodes") || "[]");
      const now = Date.now();
      const validCodes = stored.filter((c) => now - c.timestamp < 24 * 60 * 60 * 1000);
      if (validCodes.length !== stored.length) {
        localStorage.setItem("textCodes", JSON.stringify(validCodes));
      }
      setRecentCodes(validCodes.sort((a, b) => b.timestamp - a.timestamp));
    };

    loadData();
    window.addEventListener('resize', handleResize);
    const interval = setInterval(loadData, 60000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!uniqueCode) return;

    codeBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    codeBoxRef.current?.classList.add(styles.focusGlow);

    const t = setTimeout(() => {
      codeBoxRef.current?.classList.remove(styles.focusGlow);
    }, 1400);

    return () => clearTimeout(t);
  }, [uniqueCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCopiedCode(null);
    if (!content.trim()) return setToast({ message: "Please enter text to share.", type: "error" });

    setLoading(true);
    setUniqueCode("");

    try {
      let durationString = null;
      if (expiryHours || expiryMinutes) {
        const h = expiryHours ? String(expiryHours).padStart(2, '0') : "00";
        const m = expiryMinutes ? String(expiryMinutes).padStart(2, '0') : "00";
        durationString = `${h}:${m}`;
        if (durationString === "00:00") durationString = null;
      }
      const limit = viewLimit ? Number(viewLimit) : null;
      const res = await storeTextAPI(content, password, durationString, limit);

      if (res.success) {
        const newCode = { code: res.data.uniqueCode, timestamp: Date.now() };
        setToast({ message: "Text secured! Share the code below.", type: "success" });
        setUniqueCode(res.data.uniqueCode);
        setContent(""); setPassword(""); setViewLimit(""); setExpiryHours(""); setExpiryMinutes("");
        setShowAdvanced(false);

        const updatedCodes = [newCode, ...recentCodes].filter(
          (c) => Date.now() - c.timestamp < 24 * 60 * 60 * 1000
        );
        setRecentCodes(updatedCodes);
        localStorage.setItem("textCodes", JSON.stringify(updatedCodes));
      } else {
        setToast({ message: res.message || "Failed to store text.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Error connecting to server.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setToast({ message: "Code copied!", type: "success" });
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const handleDeleteCode = (code) => {
    const updated = recentCodes.filter((c) => c.code !== code);
    setRecentCodes(updated);
    localStorage.setItem("textCodes", JSON.stringify(updated));
    setToast({ message: "Code removed.", type: "success" });
  };

  const handleDeleteAll = () => {
    if (window.confirm("Clear all history?")) {
      setRecentCodes([]);
      localStorage.removeItem("textCodes");
      setToast({ message: "All history cleared.", type: "success" });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className={styles.mainCard}>
          {/* LEFT COLUMN: Input Section */}
          <section className={styles.leftColumn}>
            <header>
              <h1 className={styles.title}>Send Text Instantly Without Login</h1>
              <p className={styles.subtitle}>Securely share passwords, links, or notes. Generate a 6-digit code for instant access on any device.</p>
            </header>

            <nav className={styles.navLinks} aria-label="Tool Navigation">
              {/* 🔹 Swapped 'to' for 'href' */}
              <Link href="/receive-text" className={styles.navLinkItem}><FaDownload /> Receive Text</Link>
              <Link href="/send-files" className={styles.navLinkItem}><FaUpload /> Send Files</Link>
              <Link href="/receive-files" className={styles.navLinkItem}><FaFileImport /> Receive Files</Link>
            </nav>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text, code snippets, or notes here..."
                spellCheck="false"
              />

              <div className={styles.advancedToggleSection}>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className={styles.advancedToggleBtn}>
                  {showAdvanced ? '▼' : '►'} Privacy & Expiry Options (Optional)
                </button>
                {showAdvanced && (
                  <div className={styles.advancedFields}>
                    <div className={styles.fieldItem}>
                      <label>Password Protection:</label>
                      <input type="password" placeholder="Set a password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                    </div>
                    <div className={styles.fieldItem}>
                      <label>Max Views:</label>
                      <input type="number" min="1" placeholder="Unlimited" value={viewLimit} onChange={(e) => setViewLimit(e.target.value)} />
                    </div>
                    <div className={styles.fieldItem}>
                      <label>Expires After:</label>
                      <div className={styles.expiryGrid}>
                        <input type="number" min="0" max="23" placeholder="Hrs" value={expiryHours} onChange={(e) => setExpiryHours(e.target.value.slice(0, 2))} />
                        <input type="number" min="0" max="59" placeholder="Mins" value={expiryMinutes} onChange={(e) => setExpiryMinutes(e.target.value.slice(0, 2))} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className={styles.saveButton} type="submit" disabled={loading}>
                {loading ? "Securing Text..." : <><FaSave /> Send Text Now</>}
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className={styles.rightColumn}>
            {uniqueCode ? (
              <div ref={codeBoxRef} className={styles.resultBox} role="alert">
                <span className={styles.resultTitle}>Access Code:</span>
                <div className={styles.resultCode}>{uniqueCode}</div>
                <button type="button" className={styles.copyMainBtn} onClick={() => handleCopy(uniqueCode)}>
                  {copiedCode === uniqueCode ? "Copied!" : "Copy Code"}
                </button>
              </div>
            ) : (
              <div ref={codeBoxRef} className={styles.placeholderBox}>
                <FaMagic size={28} className={styles.magicIcon} />
                <span>Codes appear here</span>
              </div>
            )}

            <div className={styles.historyHeader}>
              <h2 className={styles.historyTitle}>Recent Activity</h2>
              {recentCodes.length > 0 && <button className={styles.clearBtn} onClick={handleDeleteAll}>Clear All</button>}
            </div>

            <ul className={styles.historyList}>
              {recentCodes.length === 0 && <li className={styles.emptyHistory}>No recent codes found</li>}
              {recentCodes.map((item, idx) => (
                <li key={idx} className={styles.historyItem}>
                  <div className={styles.codeInfo}>
                    <span className={styles.codeText}>{item.code}</span>
                    <span className={styles.timeText}>{timeAgo(item.timestamp)}</span>
                  </div>
                  <div className={styles.actionButtons}>
                    <button type="button" className={styles.iconBtn} onClick={() => handleCopy(item.code)}>
                      {copiedCode === item.code ? <FaCheck color="#14b8a6" /> : <FaCopy />}
                    </button>
                    <button type="button" className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteCode(item.code)}>
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* SEO CONTENT SECTION */}
        <section className={styles.seoFooterContent}>
          <div className={styles.seoArticle}>
            <h2>🚀 What is an Online Clipboard?</h2>
            <p>ShareBy's text tool acts as a <strong>temporary online clipboard</strong>. It allows you to paste text on one device and retrieve it on another using a simple 6-digit code. Whether you are moving a long URL from PC to mobile or sharing meeting notes, it is the fastest way to <strong>send text without login</strong>.</p>
          </div>
          <div className={styles.seoArticle}>
            <h2>🔐 Secure Password Sharing</h2>
            <p>Stop sending sensitive passwords over insecure chat apps. Use ShareBy to <strong>share passwords securely</strong> by setting a "1-view limit." Once the recipient views the text, it self-destructs from our servers permanently.</p>
          </div>
          <div className={styles.seoArticle}>
            <h2>⚡ How to Share Text Online</h2>
            {/* 🔹 Replaced bare ol tag with standard class to prevent CSS module crash */}
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', listStyleType: 'decimal' }}>
              <li><strong>Paste your text</strong> into the box above.</li>
              <li>Optionally set a <strong>password</strong> or <strong>self-destruct timer</strong>.</li>
              <li>Click <strong>Send Text Now</strong> to generate a unique code.</li>
              <li>Share the 6-digit code with the recipient.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StoreTextClient;