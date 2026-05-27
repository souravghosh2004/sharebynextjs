import { Suspense } from "react";
import UploadFileClient from "./UploadFileClient";

// ✅ NEXT.JS NATIVE SEO
export const metadata = {
  title: "Send Files Without Login | Instant Transfer – ShareBy",
  description: "The fastest way to send files online without login. Upload files and get a 6-digit code.",
  alternates: {
    canonical: "https://shareby.io/send-files",
  },
  openGraph: {
    title: "Send Files Instantly (No Login Required) – ShareBy",
    description: "Need to send a file fast? No signup, no tracking, 100% anonymous.",
    url: "https://shareby.io/send-files",
    type: "website",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy File Transfer",
      },
    ],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShareBy File Transfer",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Fast and secure file sharing without login. Upload files and get a 6-digit code.",
  featureList: "500MB limit, Self-destructing files, Password protection",
};

export default function SendFilesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* 🔹 Suspense is required in Next.js when using useSearchParams in children */}
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading uploader...</div>}>
        <UploadFileClient />
      </Suspense>
    </>
  );
}