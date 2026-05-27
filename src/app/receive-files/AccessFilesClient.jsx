"use client"; // 🚀 Mandatory for state, progress tracking, and AbortControllers

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Replaces react-router-dom
import axios from "axios";
import { getFilesByCode } from "../../api/user.api.js"; // Fixed API Path
import styles from "./AccessFiles.module.css";
import Toast from "../../components/Toast";
import {
  FaSearch, FaDownload, FaEye, FaCloudDownloadAlt,
  FaFileAlt, FaFileImage, FaFilePdf, FaFileAudio, FaFileVideo, FaFileCode, FaFileArchive,
  FaUpload, FaPenNib, FaLock, FaUnlock, FaTimesCircle
} from "react-icons/fa";

// Advertisement Components (Keep commented if not ready)
// import Adsterra300x250 from '../../advertisement/Adsterra300x250.jsx';
// import ResponsiveAd from '../../advertisement/ResponsiveAd.jsx';

const AccessFilesClient = () => {
  const [code, setCode] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Track download progress: { [index]: percentage }
  const [downloadProgress, setDownloadProgress] = useState({});

  // Track AbortControllers to cancel downloads: { [index]: AbortController }
  const [downloadControllers, setDownloadControllers] = useState({});

  const [toast, setToast] = useState(null);

  // Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [targetCode, setTargetCode] = useState("");

  // ✅ NEXT.JS FIX: Safe window check for initial state
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 900);
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFetchFiles = async (e, customPassword = null) => {
    if (e) e.preventDefault();
    const codeToSearch = targetCode || code.trim();
    const pwdToSend = customPassword || null;

    if (codeToSearch.length < 4) {
      return setToast({ message: "Code must be 6 digits", type: "error" });
    }

    setLoading(true);
    setFiles([]);

    try {
      const result = await getFilesByCode(codeToSearch, pwdToSend);

      if (result.success && Array.isArray(result.data)) {
        setFiles(result.data);
        setToast({ message: `Found ${result.data.length} file(s)`, type: "success" });
        setShowPasswordModal(false);
        setPasswordInput("");
        setTargetCode("");
      } else if (result.isPasswordProtected) {
        setTargetCode(codeToSearch);
        setShowPasswordModal(true);
        setToast({ message: "This file is password protected.", type: "info" });
      } else {
        setToast({ message: result.message || "Invalid code or file not found", type: "error" });
      }
    } catch (err) {
      if (err.response?.data?.isPasswordProtected) {
        setTargetCode(codeToSearch);
        setShowPasswordModal(true);
        setToast({ message: "This file is password protected.", type: "info" });
      } else {
        setToast({ message: err.response?.data?.message || "Connection error", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = () => {
    if (!passwordInput) return setToast({ message: "Please enter password", type: "error" });
    handleFetchFiles(null, passwordInput);
  };

  // 🛑 CANCEL DOWNLOAD
  const cancelDownload = (idx) => {
    const controller = downloadControllers[idx];
    if (!controller) return;

    controller.abort();

    setDownloadControllers((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });

    setDownloadProgress((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });

    setToast({ message: "Download Cancelled", type: "info" });
  };


  // ⬇️ DOWNLOAD WITH PROGRESS + SAFE CANCEL
  const handleDownload = async (url, fileName, idx) => {
    if (!url) return;

    // Prevent double click multiple downloads
    if (downloadControllers[idx]) return;

    const controller = new AbortController();

    setDownloadControllers((prev) => ({
      ...prev,
      [idx]: controller
    }));

    setDownloadProgress((prev) => ({
      ...prev,
      [idx]: 0
    }));

    try {
      const response = await axios.get(url, {
        responseType: "blob",
        signal: controller.signal,
        onDownloadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.floor(
            (event.loaded * 100) / event.total
          );

          setDownloadProgress((prev) => ({
            ...prev,
            [idx]: percent
          }));
        }
      });

      // Auto-save file
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "shareby_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Show 100% briefly
      setDownloadProgress((prev) => ({
        ...prev,
        [idx]: 100
      }));

      setTimeout(() => {
        setDownloadProgress((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });

        setDownloadControllers((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });
      }, 800);

    } catch (err) {

      // Proper AbortController detection
      if (err.code === "ERR_CANCELED") {
        return;
      }

      console.error("Download error:", err);
      setToast({ message: "Download failed", type: "error" });

      setDownloadProgress((prev) => {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      });

      setDownloadControllers((prev) => {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      });
    }
  };

  const getFileIcon = (ext) => {
    switch (ext) {
      case 'jpg': case 'jpeg': case 'png': case 'webp': return <FaFileImage />;
      case 'pdf': return <FaFilePdf />;
      case 'mp3': case 'wav': return <FaFileAudio />;
      case 'mp4': case 'mov': return <FaFileVideo />;
      case 'zip': case 'rar': return <FaFileArchive />;
      case 'js': case 'html': case 'css': case 'py': return <FaFileCode />;
      default: return <FaFileAlt />;
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
              <FaLock size={32} color="var(--brand-primary)" />
            </div>
            <h3 className={styles.modalTitle}>Password Protected</h3>
            <p className={styles.modalText}>
              The files for code <strong>{targetCode}</strong> are secured. <br />
              Please enter the password to unlock them.
            </p>
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
                disabled={loading}
              >
                {loading ? "Unlocking..." : <><FaUnlock /> Unlock Files</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.container}>
        <div className={styles.mainCard}>
          {/* LEFT COLUMN: Input & Navigation */}
          <section className={styles.leftColumn}>
            <header>
              <h1 className={styles.title}>Access Files Without Login</h1>
              <p className={styles.subtitle}>Enter the 6-digit code to view or download shared content.</p>
            </header>

            <nav className={styles.navLinks}>
              {/* 🔹 Replaced react-router-dom Link with next/link */}
              <Link href="/send-files" className={styles.navLinkItem}><FaUpload /> Send Files</Link>
              <Link href="/send-text" className={styles.navLinkItem}><FaPenNib /> Send Text</Link>
              <Link href="/receive-text" className={styles.navLinkItem}><FaDownload /> Receive Text</Link>
            </nav>

            <form className={styles.form} onSubmit={(e) => handleFetchFiles(e)}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER 6-DIGIT CODE"
                maxLength={6}
                className={styles.input}
                disabled={showPasswordModal}
              />
              <button type="submit" className={styles.fetchBtn} disabled={loading || showPasswordModal}>
                {loading && !showPasswordModal ? <div className={styles.spinner}></div> : <FaSearch />}
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: File Grid & Responsive Banner */}
          <aside className={styles.rightColumn}>
            {files.length > 0 ? (
              <div className={styles.grid}>
                {files.map((file, idx) => {
                  const fileName = file.fileName || `File ${idx + 1}`;
                  const ext = fileName.split(".").pop().toLowerCase();
                  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);

                  // Check download status for THIS file
                  const isDownloading = !!downloadControllers[idx];
                  const currentProgress = downloadProgress[idx] || 0;

                  return (
                    <div key={idx} className={styles.card}>
                      <div className={styles.thumbnail}>
                        {isImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={file.lowQualityPreviewUrl || file.previewUrl}
                            alt="preview"
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.iconPreview}>
                            {getFileIcon(ext)}
                            <span>{ext.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.fileDetails}>
                          <span className={styles.fileIconMini}>{getFileIcon(ext)}</span>
                          <span className={styles.fileName} title={fileName}>{fileName}</span>
                        </div>
                        <div className={styles.actions}>

                          {/* 🔽 DOWNLOAD BUTTON */}
                          <button
                            className={styles.primaryBtn}
                            onClick={() => handleDownload(file.downloadUrl, fileName, idx)}
                            disabled={isDownloading}
                            style={{
                              background: isDownloading
                                ? `linear-gradient(90deg, var(--brand-primary) ${currentProgress}%, var(--bg-surface) ${currentProgress}%)`
                                : undefined,
                              color: isDownloading ? 'var(--text-primary)' : undefined,
                              border: isDownloading ? '1px solid var(--brand-primary)' : undefined,
                              cursor: isDownloading ? 'default' : 'pointer'
                            }}
                          >
                            {isDownloading ? (
                              `${currentProgress}%`
                            ) : (
                              <><FaDownload /> Download</>
                            )}
                          </button>

                          {/* ❌ CANCEL BUTTON (Shows when downloading) */}
                          {isDownloading ? (
                            <button
                              className={styles.secondaryBtn}
                              onClick={() => cancelDownload(idx)}
                              title="Cancel Download"
                              style={{ color: '#ef4444', borderColor: '#ef4444' }} // Red styling
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          ) : (
                            /* 👁 VIEW BUTTON (Shows when NOT downloading) */
                            <a
                              href={file.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.secondaryBtn}
                              title="View File"
                            >
                              <FaEye />
                            </a>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.placeholderBox}>
                <FaCloudDownloadAlt size={40} className={styles.placeholderIcon} />
                <p>Files will appear here</p>
              </div>
            )}
          </aside>
        </div>

        {/* SEO CONTENT SECTION */}
        <section className={styles.seoFooterContent}>
          <div className={styles.seoArticle}>
            <h2>🚀 How to Download Files?</h2>
            {/* 🔹 Replaced bare ol tag to prevent CSS module crash */}
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', listStyleType: 'decimal' }}>
              <li>Get the <strong>6-digit code</strong> from the sender.</li>
              <li>Enter it in the search box above.</li>
              <li>If the files are private, enter the <strong>password</strong>.</li>
              <li>Preview images or click <strong>Download</strong> to save them.</li>
            </ul>
          </div>
          <div className={styles.seoArticle}>
            <h2>🔒 Secure & Private</h2>
            <p>Your privacy is our priority. Files are transferred over encrypted connections and automatically <strong>permanently deleted</strong> after 24 hours (or sooner if the sender set a limit).</p>
          </div>
          <div className={styles.seoArticle}>
            <h2>📂 Supported File Types</h2>
            <p>You can receive almost anything! We support <strong>Images (JPG, PNG), Documents (PDF, DOCX), Videos (MP4), Archives (ZIP, RAR)</strong>, and code files.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccessFilesClient;