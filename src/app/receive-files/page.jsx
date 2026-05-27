import AccessFilesClient from "./AccessFilesClient";

// ✅ NEXT.JS NATIVE SEO
export const metadata = {
  title: "Receive Files Instantly | Secure & Anonymous Transfer – ShareBy",
  description: "Download files and text without login. Enter your 6-digit code to access shared content securely. Fast cross-device transfer for iOS, Android, and PC.",
  alternates: {
    canonical: "https://shareby.io/receive-files",
  },
  openGraph: {
    title: "Receive Files via Code | No Login Required",
    description: "Got a code? Enter it here to download files instantly. No signup, no app, 100% private.",
    url: "https://shareby.io/receive-files",
    type: "website",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy Receive Files",
      },
    ],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShareBy Receive",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Securely retrieve files using a 6-digit code. Decrypt password-protected files instantly.",
  featureList: "Instant download, Image preview, Cross-platform, Safe cancellation"
};

export default function ReceiveFilesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <AccessFilesClient />
    </>
  );
}