import styles from "./About.module.css";

// ✅ NEXT.JS NATIVE SEO
export const metadata = {
  title: "About ShareBy | Secure Sharing Without Login",
  description: "Learn about ShareBy, the fastest way to share files and text without login. Built for privacy, students, and cyber cafés. No signup, just a 6-digit code.",
  alternates: {
    canonical: "https://shareby.io/about",
  },
  openGraph: {
    title: "About ShareBy | Secure Sharing Without Login",
    description: "Learn about ShareBy, the fastest way to share files and text without login. Built for privacy, students, and cyber cafés.",
    url: "https://shareby.io/about",
    siteName: "ShareBy",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy - Secure File Sharing",
      },
    ],
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ShareBy free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ShareBy is free for normal file sharing without login.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account to use ShareBy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Most users can upload and share files without creating an account. Accounts are optional and used only for managed services.",
      },
    },
    {
      "@type": "Question",
      name: "How does ShareBy work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You upload a file, receive a short access code, and share that code. Anyone with the code can access the file until it expires.",
      },
    },
    {
      "@type": "Question",
      name: "How long are files stored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Files are stored temporarily and automatically deleted after a limited time. Retention duration may vary based on usage type.",
      },
    },
    {
      "@type": "Question",
      name: "Is ShareBy secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Files are transferred over HTTPS and protected by access codes, rate limiting, and temporary storage. ShareBy does not track users or analyze file content.",
      },
    },
    {
      "@type": "Question",
      name: "Is ShareBy suitable for cyber cafés or public computers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ShareBy is designed for public or shared computers where logging into personal accounts is unsafe or inconvenient.",
      },
    },
    {
      "@type": "Question",
      name: "Does ShareBy track users or show ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ShareBy does not track users, show advertisements, or sell user data.",
      },
    },
    {
      "@type": "Question",
      name: "Can deleted or expired files be recovered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Once files are deleted or expired, they cannot be recovered.",
      },
    },
  ],
};

export default function About() {
  return (
    <>
      {/* JSON-LD for AI & Search Engines (Safely injected for Next.js) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className={styles.mainContainer}>
        <div className={styles.aboutContainer}>
          {/* LEFT BOX */}
          <div className={styles.leftBox}>
            <div>
              About <br />
              <span>ShareBy</span>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className={styles.rightBox}>
            <h2>About ShareBy (File Send)</h2>
            <p className={styles.updated}>
              Simple, secure file sharing without login
            </p>

            {/* INTRO */}
            <p className={styles.introText}>
              ShareBy was built to solve a simple but common problem — securely
              sending or printing files from any device without logging into
              personal accounts, especially in public or shared environments.
            </p>

            {/* AI SUMMARY */}
            <div className={styles.section}>
              <h3>🤖 Quick Summary</h3>
              <p>
                <strong>ShareBy</strong> is a privacy-focused file sharing
                platform that allows users to upload files or text and share
                them instantly using a short access code. It works without login
                or signup for normal use and stores files temporarily with
                automatic expiration. ShareBy is designed for students,
                teachers, and cyber cafés where logging into personal accounts
                or using USB drives is unsafe or inconvenient.
              </p>
            </div>

            {/* PROBLEM */}
            <div className={styles.section}>
              <h3>🧠 The Problem Today</h3>
              <ul>
                <li>
                  <strong>Privacy Risk:</strong> Sharing phone numbers or emails
                  with unknown people or cyber cafés.
                </li>
                <li>
                  <strong>Risky Logins:</strong> Logging into WhatsApp, Gmail,
                  or Drive on public computers.
                </li>
                <li>
                  <strong>Virus & Leftover Files:</strong> Pen drives can spread
                  malware and leave files behind.
                </li>
                <li>
                  <strong>Time-Consuming:</strong> Teachers sending files one by
                  one.
                </li>
              </ul>
            </div>

            {/* SOLUTION */}
            <div className={styles.section}>
              <h3>🌱 Our Solution: File Send</h3>
              <ul>
                <li>
                  <strong>Upload & Get Code:</strong> Upload a file and receive
                  a short access code.
                </li>
                <li>
                  <strong>Share Anywhere:</strong> Share the code verbally, on a
                  board, or via message.
                </li>
                <li>
                  <strong>Access Instantly:</strong> Anyone with the code can
                  view, download, or print.
                </li>
                <li>
                  <strong>No Login Required:</strong> No email or phone number
                  needed for normal use.
                </li>
                <li>
                  <strong>Auto-Expiry:</strong> Files automatically expire after
                  a limited time.
                </li>
              </ul>
            </div>

            {/* WHO BENEFITS */}
            <div className={styles.section}>
              <h3>🧑‍🏫 Who Benefits?</h3>
              <ul>
                <li>
                  <strong>Students:</strong> Print assignments safely at cyber
                  cafés.
                </li>
                <li>
                  <strong>Teachers & Coaching Centers:</strong> Share notes with
                  entire classes.
                </li>
                <li>
                  <strong>Cyber Café & Print Shops:</strong> No leftover files,
                  less virus risk.
                </li>
                <li>
                  <strong>Anyone:</strong> Fast, private, one-time file sharing.
                </li>
              </ul>
            </div>

            {/* SECURITY */}
            <div className={styles.section}>
              <h3>🔒 Security & Privacy</h3>
              <ul>
                <li>
                  <strong>Strong Codes:</strong> Short alphanumeric codes
                  provide billions of combinations, making random guessing
                  highly impractical.
                </li>
                <li>
                  <strong>Rate Limiting:</strong> Backend protections prevent
                  brute-force attempts.
                </li>
                <li>
                  <strong>Temporary Storage:</strong> Files are stored
                  temporarily and auto-deleted.
                </li>
                <li>
                  <strong>No Tracking:</strong> ShareBy does not track users or
                  display ads.
                </li>
                <li>
                  <strong>No Personal Data:</strong> No personal contact details
                  required for normal use.
                </li>
              </ul>
            </div>

            {/* USE CASES */}
            <div className={styles.section}>
              <h3>🖨️ Real-life Use Cases</h3>
              <ul>
                <li>
                  A teacher uploads once and shares the code with the whole
                  class.
                </li>
                <li>
                  A student prints files at a cyber café without logging in.
                </li>
                <li>
                  Café owners avoid leftover files and daily cleanup.
                </li>
                <li>
                  Safe sharing even between strangers using code-only access.
                </li>
              </ul>
            </div>

            {/* FAQ (VISIBLE) */}
            <div className={styles.section}>
              <h3>❓ Frequently Asked Questions</h3>
              <ul>
                <li>
                  <strong>Is ShareBy free?</strong> Yes, for normal file
                  sharing.
                </li>
                <li>
                  <strong>Do I need an account?</strong> No, login is not
                  required for normal use.
                </li>
                <li>
                  <strong>How does it work?</strong> Upload → get code → share.
                </li>
                <li>
                  <strong>How long are files stored?</strong> Temporarily, with
                  auto-deletion.
                </li>
                <li>
                  <strong>Is ShareBy secure?</strong> Yes, with HTTPS, access
                  codes, and rate limiting.
                </li>
                <li>
                  <strong>Does ShareBy track users?</strong> No tracking, no
                  ads.
                </li>
                <li>
                  <strong>Can files be recovered?</strong> No, once deleted or
                  expired.
                </li>
              </ul>
            </div>

            {/* CREATOR INFO */}
            <div className={styles.section}>
              <h3>👨‍💻 Creator</h3>
              <p>
                ShareBy is independently designed and developed by{" "}
                <a
                  href="https://souravghosh2004.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.creatorLink}
                >
                  Sourav Ghosh
                </a>
                , with a focus on privacy-first, login-free file sharing for
                real-world use cases such as students, teachers, and public
                computer environments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}