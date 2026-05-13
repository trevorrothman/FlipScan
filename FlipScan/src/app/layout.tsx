import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlipScan - Instant Business Acquisition Analysis",
  description: "Paste any business listing and get a full acquisition analysis powered by Claude AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
