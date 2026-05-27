import StoreTextClient from "./StoreTextClient";

// ✅ NEXT.JS NATIVE SEO (Renders instantly for Googlebot)
export const metadata = {
  title: "Send Text Online Without Login | Secure Online Clipboard – ShareBy",
  description: "Fastest way to share text, passwords, and links online without login. Paste text and get a secure 6-digit code for instant cross-device transfer.",
  alternates: {
    canonical: "https://shareby.io/send-text",
  },
  openGraph: {
    title: "Secure Text Sharing (No Login Required) – ShareBy",
    description: "Paste it here and get a code. No signup, no tracking.",
    url: "https://shareby.io/send-text",
    type: "website",
    images: [
      {
        url: "https://shareby.io/shareby-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "ShareBy Secure Text Sharing",
      },
    ],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShareBy Text",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "A free online clipboard tool to securely share text, passwords, and links.",
  featureList: "Self-destructing text, Password protection, Instant sharing code",
};

export default function SendTextPage() {
  return (
    <>
      {/* Safely inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Load the interactive React UI */}
      <StoreTextClient />
    </>
  );
}