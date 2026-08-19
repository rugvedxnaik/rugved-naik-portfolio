import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Le Dossier | Rugved Naik",
      template: "%s",
    },
    description:
      "A French HR-facing dossier portfolio by Rugved Naik for PM, PMM, consumer strategy, and product marketing internships.",
    applicationName: "Le Dossier",
    keywords: [
      "consumer insight",
      "product strategy",
      "marketing strategy",
      "brand strategy",
      "CRM strategy",
      "category analysis",
      "Paris",
    ],
    authors: [{ name: "Rugved Naik" }],
    openGraph: {
      title: "Le Dossier | Rugved Naik",
      description:
        "A fast dossier for hiring teams: availability, experience, method, selected cases, and CV PDF.",
      type: "website",
      locale: "en_US",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Le Dossier | Rugved Naik" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Le Dossier | Rugved Naik",
      description:
        "A fast dossier for hiring teams: availability, experience, method, selected cases, and CV PDF.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
