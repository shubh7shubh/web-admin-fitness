import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexOne - Track Nutrition, Join Challenges, Get Fit",
  description: "Gamified fitness tracking app with calorie counting, macro tracking, social challenges, and leaderboards. Download now for iOS and Android.",
  keywords: ["fitness tracker", "calorie counter", "macro tracker", "fitness app", "weight loss app", "nutrition tracker"],
  openGraph: {
    title: "ApexOne - Track Nutrition, Join Challenges, Get Fit",
    description: "Gamified fitness tracking with social features. Track calories, join challenges, climb leaderboards.",
    type: "website",
    locale: "en_US",
    siteName: "ApexOne",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexOne - Track Nutrition, Join Challenges, Get Fit",
    description: "Gamified fitness tracking with social features.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
