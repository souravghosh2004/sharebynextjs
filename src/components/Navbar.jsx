"use client"; // 🚀 REQUIRED for state, effects, and Next.js hooks

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; // Replaces NavLink
import { usePathname, useRouter } from 'next/navigation'; // Replaces useNavigate
import Image from 'next/image'; // Next.js native optimized image
import { useAuth } from "../context/AuthProvider";
import styles from "./Navbar.module.css";
import {
  FaHome, FaCloudUploadAlt,
  FaRegFileAlt, FaMoon, FaSun, FaUserCircle, FaInbox
} from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";
import { logoutUser } from '../api/auth.api.js';// Adjust path if necessary

const Navbar = () => {
  const { user, setUser } = useAuth();
  
  // 🔹 NEXT.JS ROUTING HOOKS
  const router = useRouter(); 
  const pathname = usePathname(); // Replaces NavLink's active state logic
  
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  // --- THEME LOGIC ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;
      if (window.innerWidth > 768) return "dark";
    }
    return "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      const response = await logoutUser();
      if (response.success) {
        setUser(null);
        router.replace("/"); // Replaces navigate("/", { replace: true })
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          
          <Link href="/" className={styles.logo}>
            {/* 🔹 NEXT.JS IMAGE OPTIMIZATION */}
            <Image 
              src="/logo.webp" 
              alt="ShareBy Logo" 
              width={42} 
              height={42} 
              className={styles.logoImg} 
            />
            <span className={styles.logoText}>ShareBy</span>
          </Link>

          <ul className={styles.desktopNav}>
            {/* 🔹 MANUAL ACTIVE STATE LOGIC USING pathname */}
            <li><Link href="/" className={pathname === "/" ? styles.activeLink : styles.link}>Home</Link></li>
            <li><Link href="/send-files" className={pathname === "/send-files" ? styles.activeLink : styles.link}>Send Files</Link></li>
            <li><Link href="/receive-files" className={pathname === "/receive-files" ? styles.activeLink : styles.link}>Receive Files</Link></li>
            <li><Link href="/send-text" className={pathname === "/send-text" ? styles.activeLink : styles.link}>Send Text</Link></li>
            <li><Link href="/receive-text" className={pathname === "/receive-text" ? styles.activeLink : styles.link}>Receive Text</Link></li>
            {user && (
              <li><Link href="/print-files" className={pathname === "/print-files" ? styles.activeLink : styles.link}>Print Files</Link></li>
            )}
          </ul>

          <div className={styles.rightActions} ref={menuRef}>
            <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            {user ? (
              <div className={styles.userContainer}>
                <div 
                  className={styles.userAvatar} 
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>

                <div className={`${styles.popupMenu} ${openMenu ? styles.showMenu : ""}`}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{user.fullName}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  
                  <Link href="/dashboard" className={styles.popupItem} onClick={() => setOpenMenu(false)}>Dashboard</Link>
                  <a 
                    href="https://api.shareby.io/api/v1/qrcode/show" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.popupItem}
                    onClick={() => setOpenMenu(false)}
                  >
                    My QR Code ↗
                  </a>
                  <Link href="/auth/change-password" className={styles.popupItem} onClick={() => setOpenMenu(false)}>Change Password</Link>
                  
                  <hr className={styles.divider} />
                  <button className={`${styles.popupItem} ${styles.logoutBtn}`} onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM BAR */}
      <div className={styles.mobileBottomBar}>
        <Link href="/" className={pathname === "/" ? styles.mobileActive : styles.mobileLink}>
          <FaHome className={styles.mobileIcon} />
          <span>Home</span>
        </Link>

        <Link href="/send-files" className={pathname === "/send-files" ? styles.mobileActive : styles.mobileLink}>
          <FaCloudUploadAlt className={styles.mobileIcon} />
          <span>Send Files</span>
        </Link>

        <Link href="/receive-files" className={pathname === "/receive-files" ? styles.mobileActive : styles.mobileLink}>
          <FaCloudUploadAlt className={`${styles.mobileIcon} ${styles.rotateIcon}`} />
          <span>Receive</span>
        </Link>

        <Link href="/scan" className={pathname === "/scan" ? styles.mobileActive : styles.mobileLink}>
          <MdQrCodeScanner className={styles.mobileIcon} />
          <span>Scan</span>
        </Link>

        <Link href="/send-text" className={pathname === "/send-text" ? styles.mobileActive : styles.mobileLink}>
          <FaRegFileAlt className={styles.mobileIcon} />
          <span>Send Text</span>
        </Link>
          <Link href="/receive-text" className={pathname === "/receive-text" ? styles.mobileActive : styles.mobileLink}>
          <FaInbox className={styles.mobileIcon} />
          <span>Receive</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;