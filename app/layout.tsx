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
      default: "The Consumer Read | Rugved Naik",
      template: "%s",
    },
    description:
      "A consumer centric product and marketing strategy portfolio by Rugved Naik.",
    applicationName: "The Consumer Read",
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
      title: "The Consumer Read | Rugved Naik",
      description:
        "Consumer behavior translated into product logic, brand memory, and marketing systems.",
      type: "website",
      locale: "en_US",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "The Consumer Read | Rugved Naik" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Consumer Read | Rugved Naik",
      description:
        "Consumer behavior translated into product logic, brand memory, and marketing systems.",
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
