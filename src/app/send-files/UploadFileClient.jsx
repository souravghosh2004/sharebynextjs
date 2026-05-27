"use client"; // 🚀 Mandatory for state, refs, browser compression, and dropping files

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // 🔹 Replaces react-router-dom
import Link from "next/link"; // 🔹 Replaces react-router-dom Link
import axios from "axios";
import imageCompression from "browser-image-compression"; 
import styles from "./UploadFile.module.css";
// 🔹 Make sure this path correctly points to your api folder
import { uploadFiles, updateStatus } from "../../api/user.api.js"; 
import Toast from "../../components/Toast.jsx";
import {
  FaMagic,
  FaPenSquare,
  FaDownload,
  FaFileImport,
  FaUpload,
  FaCheck,
  FaTrash,
} from "react-icons/fa";

// Advertisement Components (keep commented if needed)
// import Adsterra300x250 from "../../advertisement/Adsterra300x250.jsx";
// import ResponsiveAd from "../../advertisement/ResponsiveAd.jsx";

const UploadFileClient = () => {
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

  const params = useSearchParams();
  const receiverId = params.get("userId") || null;
  const receiverName = params.get("userName");

  const fileStoreRef = useRef(new Map()); // tempId -> File

  const [fileList, setFileList] = useState([]); // [{ tempId, key, name, size, type }]
  const [totalSize, setTotalSize] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);

  const [uniqueCodes, setUniqueCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [uCode, setUCode] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [downloadLimit, setDownloadLimit] = useState("");
  const [password, setPassword] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");
  const [showReceiverOnly, setShowReceiverOnly] = useState(true);

  // ✅ NEXT.JS FIX: Safe window check for initial state
  const [isDesktop, setIsDesktop] = useState(true);
  const codeBoxRef = useRef(null);

  const progressMapRef = useRef({});
  const lastProgressUpdateRef = useRef(0);

  const generateTempId = () =>
    crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);

  const timeAgo = (ts) => {
    const diff = Date.now() - ts;
    const hr = Math.floor(diff / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    return hr > 0 ? `${hr}h ago` : min > 0 ? `${min}m ago` : "Just now";
  };

  useEffect(() => {
    // Safely execute client-side only code
    setIsDesktop(window.innerWidth > 900);
    const handleResize = () => setIsDesktop(window.innerWidth > 900);

    const loadHistory = () => {
      const now = Date.now();
      const stored = JSON.parse(localStorage.getItem("allUniqueCodes") || "[]");
      const validCodes = stored
        .filter((c) => now - c.timestamp < 24 * 60 * 60 * 1000)
        .sort((a, b) => b.timestamp - a.timestamp);
      setUniqueCodes(validCodes);
    };

    loadHistory();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!uCode) return;

    codeBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    codeBoxRef.current?.classList.add(styles.focusGlow);

    const t = setTimeout(() => {
      codeBoxRef.current?.classList.remove(styles.focusGlow);
    }, 1400);

    return () => clearTimeout(t);
  }, [uCode]);

  const addFiles = useCallback(
    (newFileList) => {
      const incoming = Array.from(newFileList);

      setFileList((prev) => {
        const updated = [...prev];

        for (const file of incoming) {
          const key = `${file.name}-${file.size}`;
          if (updated.some((f) => f.key === key)) continue;

          const tempId = generateTempId();
          fileStoreRef.current.set(tempId, file);

          updated.push({
            tempId,
            key,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
          });
        }

        const newTotal = updated.reduce((s, f) => s + f.size, 0);

        if (newTotal > MAX_FILE_SIZE) {
          setMessage({
            type: "error",
            text: "Total size limit (500MB) exceeded.",
          });
        }

        setTotalSize(newTotal);
        return updated;
      });
    },
    [MAX_FILE_SIZE]
  );

  const handleRemoveFile = (idx) => {
    setFileList((prev) => {
      const removed = prev[idx];
      if (removed?.tempId) fileStoreRef.current.delete(removed.tempId);

      const updated = prev.filter((_, i) => i !== idx);
      setTotalSize(updated.reduce((s, f) => s + f.size, 0));
      return updated;
    });
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = null;
  };

  useEffect(() => {
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    };

    window.addEventListener("dragover", handleDrag);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("drop", handleDrop);
    };
  }, [addFiles]);

  const handleSubmit = async () => {
    if (fileList.length === 0) return;

    if (totalSize > MAX_FILE_SIZE) {
      setMessage({ type: "error", text: "Total size limit (500MB) exceeded." });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    progressMapRef.current = {};
    lastProgressUpdateRef.current = 0;

    try {
      const payload = fileList.map((f) => ({
        tempId: f.tempId,
        fileName: f.name,
        fileType: f.type,
        fileSize: f.size,
      }));

      const totalSizeSum = payload.reduce((sum, f) => sum + f.fileSize, 0);

      let durationString = null;
      if (expiryHours || expiryMinutes) {
        const h = expiryHours ? String(expiryHours).padStart(2, "0") : "00";
        const m = expiryMinutes ? String(expiryMinutes).padStart(2, "0") : "00";
        durationString = `${h}:${m}`;
        if (durationString === "00:00") durationString = null;
      }

      const advancedOptions = {
        downloadLimit: downloadLimit ? Number(downloadLimit) : null,
        expiryDuration: durationString,
        showReceiverOnly: receiverId ? showReceiverOnly : false,
        password: !receiverId && password ? password : null,
      };

      const response = await uploadFiles(payload, receiverId, advancedOptions);
      if (!response?.success) throw new Error("Init failed");

      const { uploads, uniqueCode } = response.data;

      const getCompressedBlob = async (file) => {
        if (!file.type.startsWith("image/")) return null;
        try {
          const options = {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 600,
            useWebWorker: true,
            fileType: "image/jpeg",
          };
          return await imageCompression(file, options);
        } catch (err) {
          console.error("Compression skipped for file:", file.name);
          return null;
        }
      };

      const uploadOne = async (u) => {
        const fileObj = fileStoreRef.current.get(u.tempId);
        if (!fileObj) return Promise.reject(new Error("File missing in memory"));

        const promises = [];

        const mainUpload = axios.put(u.signedUrl, fileObj, {
          headers: {
            "Content-Type": fileObj.type || "application/octet-stream",
          },
          onUploadProgress: (e) => {
            progressMapRef.current[u.tempId] = e.loaded;

            const totalUploaded = Object.values(progressMapRef.current).reduce(
              (a, b) => a + b,
              0
            );

            const percent = Math.round((totalUploaded / totalSizeSum) * 100);

            const now = Date.now();
            if (now - lastProgressUpdateRef.current > 120) {
              lastProgressUpdateRef.current = now;
              setUploadProgress(percent);
            }
          },
        });
        promises.push(mainUpload);

        if (u.lowQualitySignedUrl) {
          const compressedBlob = await getCompressedBlob(fileObj);
          if (compressedBlob) {
            const lqUpload = axios.put(u.lowQualitySignedUrl, compressedBlob, {
              headers: { "Content-Type": "image/jpeg" },
            });
            promises.push(lqUpload);
          }
        }

        return Promise.all(promises);
      };

      const CONCURRENCY = 3;

      for (let i = 0; i < uploads.length; i += CONCURRENCY) {
        const chunk = uploads.slice(i, i + CONCURRENCY);
        await Promise.all(chunk.map(uploadOne));
      }

      await updateStatus(uniqueCode, true);

      setUploadProgress(100);
      setMessage({ type: "success", text: "Upload Complete!" });
      setUCode(uniqueCode);

      const newHistory = [
        { code: uniqueCode, timestamp: Date.now() },
        ...uniqueCodes,
      ].slice(0, 30);

      setUniqueCodes(newHistory);
      localStorage.setItem("allUniqueCodes", JSON.stringify(newHistory));

      fileStoreRef.current.clear();
      setFileList([]);
      setTotalSize(0);
      setDownloadLimit("");
      setExpiryHours("");
      setExpiryMinutes("");
      setPassword("");
      setShowReceiverOnly(true);
      setShowAdvanced(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleDeleteCode = (index) => {
    const updated = uniqueCodes.filter((_, i) => i !== index);
    setUniqueCodes(updated);
    localStorage.setItem("allUniqueCodes", JSON.stringify(updated));
  };

  const limitExceeded = totalSize > MAX_FILE_SIZE;

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {message && (
          <Toast
            message={message.text}
            type={message.type}
            onClose={() => setMessage(null)}
          />
        )}

        <div className={styles.mainCard}>
          {/* LEFT COLUMN */}
          <section className={styles.leftColumn}>
            {receiverName && (
              <div
                style={{
                  marginBottom: "1rem",
                  color: "var(--brand-primary)",
                  fontWeight: "bold",
                }}
              >
                Sending to: {receiverName}
              </div>
            )}

            <header>
              <h1 className={styles.title}>Send Files Instantly Without Login</h1>
              <p className={styles.subtitle}>
                Select files (max 500MB). Get a share code instantly.
              </p>
            </header>

            <nav className={styles.navLinks} aria-label="Tool Navigation">
              {/* 🔹 Swapped 'to' for 'href' */}
              <Link href="/send-text" className={styles.navLinkItem}>
                <FaPenSquare /> Send Text
              </Link>
              <Link href="/receive-text" className={styles.navLinkItem}>
                <FaDownload /> Receive Text
              </Link>
              <Link href="/receive-files" className={styles.navLinkItem}>
                <FaFileImport /> Receive Files
              </Link>
            </nav>
            {fileList.length > 0 && (
              <ul className={styles.fileList}>
                {fileList.map((f, i) => (
                  <li key={f.tempId} className={styles.fileItem}>
                    <span className={styles.fileName} title={f.name}>
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className={styles.removeBtn}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.formWrapper}>
              <label htmlFor="filesInput" className={styles.dropZone}>
                <span className={styles.folderIcon}>
                  <FaUpload />
                </span>
                <span className={styles.dropTextMain}>
                  Click or Drop files here
                </span>
                <span className={styles.dropTextSub}>
                  <span>Used: {(totalSize / 1024 / 1024).toFixed(1)} / 500 MB</span>
                  <br />
                  <span>Total Files: {fileList.length}</span>
                </span>

                <input
                  type="file"
                  id="filesInput"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>

              <div className={styles.advancedToggleSection}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={styles.advancedToggleBtn}
                >
                  {showAdvanced ? "▼" : "►"} Privacy & Expiry Options (Optional)
                </button>

                {showAdvanced && (
                  <div className={styles.advancedFields}>
                    {!receiverId && (
                      <div className={styles.fieldItem}>
                        <label>Password Protection:</label>
                        <input
                          type="password"
                          placeholder="Set a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                      </div>
                    )}

                    <div className={styles.fieldItem}>
                      <label>Download Limit:</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Unlimited"
                        value={downloadLimit}
                        onChange={(e) => setDownloadLimit(e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldItem}>
                      <label>Expiration Timer:</label>
                      <div className={styles.expiryGrid}>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          placeholder="Hrs"
                          value={expiryHours}
                          onChange={(e) =>
                            setExpiryHours(e.target.value.slice(0, 2))
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="Mins"
                          value={expiryMinutes}
                          onChange={(e) =>
                            setExpiryMinutes(e.target.value.slice(0, 2))
                          }
                        />
                      </div>
                    </div>

                    {receiverId && (
                      <div className={styles.fieldItem}>
                        <label>Show Receiver Only:</label>
                        <select
                          value={showReceiverOnly ? "yes" : "no"}
                          onChange={(e) =>
                            setShowReceiverOnly(e.target.value === "yes")
                          }
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={uploading || fileList.length === 0 || limitExceeded}
                style={{
                  background: uploading
                    ? `linear-gradient(90deg, var(--brand-primary) ${uploadProgress}%, var(--bg-surface) ${uploadProgress}%)`
                    : undefined,
                }}
              >
                {uploading ? (
                  `Sending... ${uploadProgress}%`
                ) : (
                  <>
                    <FaUpload /> Send Files Now
                  </>
                )}
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <aside className={styles.rightColumn}>
            {uCode ? (
              <div ref={codeBoxRef} className={styles.resultBox} role="alert">
                <span className={styles.resultTitle}>Access Code:</span>
                <div className={styles.resultCode}>{uCode}</div>
                <button
                  className={styles.copyMainBtn}
                  onClick={() => handleCopyCode(uCode)}
                >
                  {copiedCode === uCode ? "Copied!" : "Copy Code"}
                </button>
              </div>
            ) : (
              <div  ref={codeBoxRef} className={styles.placeholderBox}>
                <FaMagic size={28} className={styles.magicIcon} />
                <span>Code will appear here</span>
              </div>
            )}

            <div className={styles.historyHeader}>
              <h3 className={styles.historyTitle}>Recent Activity</h3>
              {uniqueCodes.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={() => {
                    setUniqueCodes([]);
                    localStorage.setItem("allUniqueCodes", JSON.stringify([]));
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <ul className={styles.historyList}>
              {uniqueCodes.map((item, idx) => (
                <li key={idx} className={styles.historyItem}>
                  <div className={styles.codeInfo}>
                    <span className={styles.codeText}>{item.code}</span>
                    <span className={styles.timeText}>
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.code)}
                      className={styles.iconBtn}
                    >
                      {copiedCode === item.code ? (
                        <FaCheck color="#14b8a6" />
                      ) : (
                        "Copy"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCode(idx)}
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}

              {uniqueCodes.length === 0 && (
                <p
                  className={styles.emptyHistory}
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "var(--text-tertiary)",
                    fontSize: "0.85rem",
                  }}
                >
                  No recent sends
                </p>
              )}
            </ul>
          </aside>
        </div>

        {/* SEO CONTENT */}
        <section className={styles.seoFooterContent}>
          <div className={styles.seoArticle}>
            <h2>🚀 Fast File Transfer</h2>
            <p>
              ShareBy allows you to send files up to 500MB instantly. No email, no
              login, no hassle. Just upload and share the 6-digit code.
            </p>
          </div>

          <div className={styles.seoArticle}>
            <h2>🔒 Secure & Private</h2>
            <p>
              Your files are encrypted in transit and automatically deleted
              after 24 hours (or sooner if you set a timer).
            </p>
          </div>

          <div className={styles.seoArticle}>
            <h2>⚡ How to Send Files</h2>
            {/* 🔹 Replaced bare ol tag to prevent CSS module crash */}
            <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", listStyleType: "decimal" }}>
              <li>
                <strong>Drag & Drop</strong> files into the box above.
              </li>
              <li>
                Set optional <strong>password</strong> or{" "}
                <strong>expiration</strong>.
              </li>
              <li>
                Click <strong>Send Files Now</strong> to get your code.
              </li>
              <li>Share the code with the receiver.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UploadFileClient;