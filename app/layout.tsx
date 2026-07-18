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
      default: "Rugved Naik — Strategy Archive",
      template: "%s",
    },
    description: "Essays and case studies on the hidden purpose of products, brands, and experiences.",
    applicationName: "Rugved Naik — Strategy Archive",
    keywords: ["brand strategy", "product thinking", "consumer insight", "luxury strategy", "Paris"],
    authors: [{ name: "Rugved Naik" }],
    openGraph: {
      title: "Rugved Naik — Strategy Archive",
      description: "I explore what products, brands, and experiences are actually for.",
      type: "website",
      locale: "en_US",
      images: [{ url: `${origin}/og.png`, width: 1732, height: 900, alt: "Rugved Naik — Strategy Archive" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Rugved Naik — Strategy Archive",
      description: "I explore what products, brands, and experiences are actually for.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
