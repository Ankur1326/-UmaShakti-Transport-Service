/**
 * Single source of truth for company details used across the public site
 * (Navbar, Footer, floating WhatsApp/Call buttons, CTA sections). Reads
 * from env vars where the value is realistically deployment-specific,
 * falling back to sensible placeholder content so the UI never renders
 * empty/broken during local development.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Umashakti Transport Service",
  tagline: "Reliable freight & logistics, on time, every time.",

  phone: process.env.NEXT_PUBLIC_PHONE || "+91 9662820706",
  // Digits only, used to build tel:/wa.me links
  phoneDigits: (process.env.NEXT_PUBLIC_PHONE || "+919662820706").replace(/[^\d+]/g, ""),
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP || "+919662820706").replace(/[^\d+]/g, ""),
  email: process.env.NEXT_PUBLIC_EMAIL || "umashakti.brd@gmail.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Plot 12, Transport Nagar, Jaipur, Rajasthan 302001",

  navLinks: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/fleet", label: "Fleet" },
    { href: "/track", label: "Track Shipment" },
    { href: "/contact", label: "Contact" },
  ],

  footerServices: [
    { href: "/services#full-truckload", label: "Full Truckload" },
    { href: "/services#part-load", label: "Part Load (LTL)" },
    { href: "/services#warehousing", label: "Warehousing" },
    { href: "/services#express", label: "Express Delivery" },
  ],

  footerQuickLinks: [
    { href: "/about", label: "About Us" },
    { href: "/fleet", label: "Our Fleet" },
    { href: "/track", label: "Track Shipment" },
    { href: "/payment", label: "Make Payment" },
    { href: "/quote", label: "Get a Quote" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber.replace("+", "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildTelLink() {
  return `tel:${siteConfig.phoneDigits}`;
}