import ReceiveTextClient from "./ReceiveTextClient";

// ✅ NEXT.JS NATIVE SEO
export const metadata = {
  title: "Receive Text Without Login | Instant & Secure – ShareBy",
  description: "Instantly receive shared text without login or signup. Enter your 6-digit code to copy or download text securely.",
  alternates: {
    canonical: "https://shareby.io/receive-text",
  },
  openGraph: {
    title: "Receive Text - Secure & Fast",
    description: "Enter a code to access notes, passwords, or links instantly.",
    url: "https://shareby.io/receive-text",
    type: "website",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy Receive Text",
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
  description: "Securely retrieve text using a 6-digit code. Decrypt password-protected notes instantly.",
  featureList: "Instant decryption, PDF/CSV/TXT export, Clipboard sync"
};

export default function ReceiveTextPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ReceiveTextClient />
    </>
  );
}