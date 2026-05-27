"use client"; // 🚀 Mandatory for state, fetching, and browser APIs

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Replaces react-router-dom
import styles from "./ReceiveText.module.css";
// Fixed path to reach your api folder
import { receiveTextAPI } from "../../api/text.api.js"; 
import Toast from "../../components/Toast";
import {
  FaCopy, FaDownload, FaSearch, FaFileAlt,
  FaPenNib, FaUpload, FaFileImport,
  FaLock, FaUnlock, FaCheck
} from "react-icons/fa";

// Advertisement Components (Keep commented if not ready)
// import Adsterra300x250 from '../../advertisement/Adsterra300x250.jsx';
// import ResponsiveAd from '../../advertisement/ResponsiveAd.jsx';

const ReceiveTextClient = () => {
  const [code, setCode] = useState("");
  const [textData, setTextData] = useState(null);
  const [format, setFormat] = useState("txt");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [targetCode, setTargetCode] = useState("");

  // ✅ NEXT.JS FIX: Safe window check for initial state
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Set initial width safely after component mounts on client
    setIsDesktop(window.innerWidth > 900);

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFetch = async (e, customPassword = null) => {
    if (e) e.preventDefault();
    const codeToSearch = targetCode || code.trim();
    const pwdToSend = customPassword || null;

    if (!codeToSearch || codeToSearch.length !== 6) {
      return setToast({ message: "Please enter a valid 6-character code.", type: "error" });
    }

    setIsLoading(true);
    setTextData(null);

    try {
      const res = await receiveTextAPI(codeToSearch, pwdToSend);

      if (res.success) {
        setTextData(res.data.content);
        setToast({ message: "Text loaded successfully!", type: "success" });
        setShowPasswordModal(false);
        setPasswordInput("");
        setTargetCode("");
      } else if (res.isPasswordProtected) {
        setTargetCode(codeToSearch);
        setShowPasswordModal(true);
        setToast({ message: res.message || "Password required.", type: "info" });
      } else {
        setToast({ message: res?.message || "Invalid code.", type: "error" });
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.isPasswordProtected) {
        setTargetCode(codeToSearch);
        setShowPasswordModal(true);
        setToast({ message: errorData.message || "Password required.", type: "error" });
        if (customPassword) setPasswordInput("");
      } else {
        setToast({ message: errorData?.message || "Invalid code or connection error.", type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = () => {
    if (!passwordInput) return setToast({ message: "Please enter password", type: "error" });
    handleFetch(null, passwordInput);
  };

  const handleCopy = async () => {
    if (!textData) return;
    await navigator.clipboard.writeText(textData);
    setCopied(true);
    setToast({ message: "Copied to clipboard!", type: "success" });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = async () => {
    if (!textData) return;
    const finalName = fileName.trim() ? fileName.trim() : "shareby_text";
    const triggerDownload = (blob, extension) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${finalName}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
    };

    let blob;
    switch (format) {
      case "pdf":
        try {
          // Dynamic import is perfect here for Next.js to keep bundle small!
          const { jsPDF } = await import("jspdf");
          const doc = new jsPDF();
          const splitText = doc.splitTextToSize(textData, 180);
          doc.text(splitText, 10, 10);
          doc.save(`${finalName}.pdf`);
          setToast({ message: "Downloaded successfully!", type: "success" });
        } catch (error) {
          setToast({ message: "Failed to generate PDF.", type: "error" });
        }
        return;
      case "csv":
        blob = new Blob([textData], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, "csv");
        break;
      default:
        blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
        triggerDownload(blob, format);
        break;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.lockIconContainer}>
              <FaLock size={28} color="var(--brand-primary)" />
            </div>
            <h3 className={styles.modalTitle}>Password Required</h3>
            <p className={styles.modalText}>This content is secured. Please enter the password to unlock it.</p>
            <input
              type="password"
              className={styles.modalInput}
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitPassword()}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setShowPasswordModal(false); setPasswordInput(""); setTargetCode(""); }}
              >
                Cancel
              </button>
              <button
                className={styles.unlockBtn}
                onClick={submitPassword}
                disabled={isLoading}
              >
                {isLoading ? "Unlocking..." : <><FaUnlock /> Unlock</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.container}>
        <div className={styles.mainCard}>
          {/* --- LEFT: INPUT FORM --- */}
          <section className={styles.leftColumn}>
            <header>
              <h1 className={styles.title}>Receive Text Without Login</h1>
              <p className={styles.subtitle}>Enter the 6-digit code to view or download shared content.</p>
            </header>

            <nav className={styles.navLinks}>
              {/* 🔹 Swapped 'to' for 'href' */}
              <Link href="/send-text" className={styles.navLinkItem}><FaPenNib /> Send Text</Link>
              <Link href="/send-files" className={styles.navLinkItem}><FaUpload /> Send Files</Link>
              <Link href="/receive-files" className={styles.navLinkItem}><FaFileImport /> Receive Files</Link>
            </nav>

            <form className={styles.form} onSubmit={(e) => handleFetch(e)}>
              <input
                type="text"
                placeholder="ENTER CODE"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={styles.input}
                maxLength={6}
                disabled={showPasswordModal}
              />
              <button type="submit" className={styles.fetchBtn} disabled={isLoading || showPasswordModal}>
                {isLoading && !showPasswordModal ? "Fetching..." : <>Fetch Text <FaSearch /></>}
              </button>
            </form>
          </section>

          {/* --- RIGHT: RESULT AREA --- */}
          <aside className={styles.rightColumn}>
            {textData ? (
              <div className={styles.resultBox}>
                <div className={styles.toolbar}>
                  <span className={styles.resultLabel}>Decrypted Text</span>
                  <input
                    type="text"
                    placeholder="filename"
                    className={styles.fileNameInput}
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                  <select className={styles.formatSelect} value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="txt">.txt</option>
                    <option value="pdf">.pdf</option>
                    <option value="csv">.csv</option>
                    <option value="js">.js</option>
                    <option value="py">.py</option>
                    <option value="html">.html</option>
                  </select>
                  <button onClick={handleCopy} className={styles.iconBtn} title="Copy">
                    {copied ? <FaCheck color="var(--brand-primary)" /> : <FaCopy />}
                  </button>
                  <button onClick={handleDownload} className={styles.downloadBtn} title="Download">
                    <FaDownload /> Download
                  </button>
                </div>
                <textarea
                  className={styles.textArea}
                  readOnly
                  value={textData}
                  spellCheck="false"
                />
              </div>
            ) : (
              <div className={styles.placeholderBox}>
                <FaFileAlt size={40} className={styles.placeholderIcon} />
                <p>Content will appear here</p>
              </div>
            )}
          </aside>
        </div>

        {/* SEO CONTENT SECTION */}
        <section className={styles.seoFooterContent}>
          <div className={styles.seoArticle}>
            <h2>🚀 How to Receive Text?</h2>
            {/* 🔹 Replaced bare ol tag to prevent CSS module crash */}
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', listStyleType: 'decimal' }}>
              <li>Get the <strong>6-digit code</strong> from the sender.</li>
              <li>Enter it in the box above and click <strong>Fetch</strong>.</li>
              <li>If protected, enter the password.</li>
              <li>Copy or Download the text instantly.</li>
            </ul>
          </div>
          <div className={styles.seoArticle}>
            <h2>🔒 Is it Secure?</h2>
            <p>Yes. All text data is transmitted via SSL encryption. Once the text expires or reaches its view limit, it is permanently deleted from our servers.</p>
          </div>
          <div className={styles.seoArticle}>
            <h2>📂 Supported Formats</h2>
            <p>You can export the retrieved text as <strong>.TXT, .PDF, .CSV, .JS, .HTML</strong>, and more directly from the browser.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReceiveTextClient;