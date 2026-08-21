import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/(app)/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Transport Co. | Reliable Freight & Logistics",
    template: "%s | Transport Co.",
  },
  description:
    "Professional freight, fleet, and logistics services. Get quotes, track shipments, and manage bookings with Transport Co.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}