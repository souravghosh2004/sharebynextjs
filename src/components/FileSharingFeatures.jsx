import React from "react";
import styles from "./FileSharingFeatures.module.css";
import {
  FaUserSlash,    // No Login
  FaSlidersH,     // Customization (was Download)
  FaQrcode,       // Scanner
  FaBolt,         // Speed/Default (was Timer)
  FaInbox,        // Receiver
  FaMobileAlt,    // Mobile
  FaPrint
} from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaUserSlash />,
    title: "No Login Needed",
    description:
      "Start sharing immediately. We don't ask for emails, phone numbers, or passwords. Just upload and go.",
  },
  {
    id: 2,
    icon: <FaBolt />,
    title: "Simple by Default",
    description:
      "Don't want to think? Just upload. By default, your files stay for 24 hours with unlimited downloads. Simple.",
  },
  {
    id: 3,
    icon: <FaSlidersH />,
    title: "Optional: Advanced Controls",
    description:
      "Want more control? You CAN change the download limit (e.g., 1 download only) or set a custom timer (e.g., 5 mins). But only if you want to.",
  },

  {
    id: 4,
    icon: <FaQrcode />,
    title: "Built-in QR Scanner",
    description:
      "No need for extra apps. Use our built-in web scanner to instantly grab shared files or text.",
  },
  {
    id: 5,
    icon: <FaInbox />,
    title: "Receiver-Only Mode",
    description:
      "Just receiving? You can switch to 'Receive Mode' to accept files securely without seeing the upload options.",
  },
  {
    id: 6,
    icon: <FaMobileAlt />,
    title: "Cross-Platform",
    description:
      "Works on your terms. Share seamlessly between Android, iOS, Windows, and Mac directly through the browser.",
  },
];

const Features = () => {
  return (
    <section
      className={styles.featuresSection}
      aria-labelledby="why-choose-shareby"
    >
      <div className={styles.container}>
        <h2 id="why-choose-shareby" className={styles.heading}>
          Simple for Everyone, Powerful for You
        </h2>

        <p className={styles.subHeading}>
          Use our default settings for instant sharing, or tweak the advanced options when you need extra privacy.
        </p>

        {/* SEO Paragraph */}
        <p className={styles.seoText}>
          ShareBy is designed for speed. <strong>Skip the settings</strong> and enjoy standard 24-hour storage with unlimited downloads.
          Or, dive into the <strong>Advanced Options</strong> to set custom download limits and expiry timers. The choice is yours.
        </p>

        <div className={styles.grid}>
          {features.map(({ id, icon, title, description }) => (
            <div key={id} className={styles.card}>
              <div className={styles.iconWrapper}>
                {icon}
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{description}</p>
            </div>
          ))}
        </div>
        {/* Cyber Café / Print Shop Use Case */}
        <div className={styles.cyberCafe}>
          <div className={styles.cyberIcon}>
            <FaPrint />
          </div>

          <div className={styles.cyberContent}>
            <h3 className={styles.cyberTitle}>
              Built for Cyber Cafés & Print Shops
            </h3>

            <p className={styles.cyberDesc}>
              No need to download or store files on your computer. Customers simply scan a QR code
              or share a code, and you can directly download and print the file.
            </p>

            <p className={styles.cyberDesc}>
              No logins. No mobile numbers. No wasted time. Works with Google Lens, our built-in
              scanner, or any QR scanner. Faster service, happier customers.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;