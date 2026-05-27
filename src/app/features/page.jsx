import styles from "./Features.module.css";
import FileSharingFeatures from "../../components/FileSharingFeatures";

// ✅ NEXT.JS NATIVE SEO
export const metadata = {
  title: "ShareBy Features | Secure Login-Free File & Text Sharing",
  description: "Discover why ShareBy is the fastest way to share. Features include no-login uploads, secure 6-digit codes, instant text sharing, and auto-deletion.",
  alternates: {
    canonical: "https://shareby.io/features",
  },
  openGraph: {
    title: "ShareBy Features | Secure Login-Free File & Text Sharing",
    description: "Discover why ShareBy is the fastest way to share. Features include no-login uploads, secure 6-digit codes, instant text sharing, and auto-deletion.",
    url: "https://shareby.io/features",
    type: "website",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy Features",
      },
    ],
  },
};

export default function Features() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.features}>
        <FileSharingFeatures />
      </div>
    </div>
  );
}