import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/(app)/providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}