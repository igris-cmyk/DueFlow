import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DueFlow — Cashflow Command Center for Work-Based Businesses",
    template: "%s | DueFlow",
  },
  description:
    "Track pending payments, proof, client promises, disputes, and follow-ups from one premium cashflow command center built for contractors, freelancers, agencies, and service businesses.",
  openGraph: {
    type: "website",
    siteName: "DueFlow",
    title: "DueFlow — Cashflow Command Center for Work-Based Businesses",
    description:
      "Track pending payments, proof, client promises, disputes, and follow-ups from one premium cashflow command center built for contractors, freelancers, agencies, and service businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
