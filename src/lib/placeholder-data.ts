/**
 * Placeholder content for the public site. Once the "Website Content"
 * admin module and the Services/Fleet/Testimonial models exist, this data
 * will be replaced by real DB queries — the shape here is intentionally
 * close to what those models will look like, so swapping later is a
 * search-and-replace of the data source, not the components.
 */

export const trustStats = [
  { value: "10+", label: "Years in Business" },
  { value: "50+", label: "Cities Served" },
  { value: "2,000+", label: "Shipments Delivered" },
  { value: "4.8/5", label: "Average Customer Rating" },
] as const;

export const whyChooseUs = [
  {
    title: "Reliable Service",
    description: "Dependable pickups and deliveries you can plan your business around.",
    icon: "ShieldCheck",
  },
  {
    title: "On-Time Delivery",
    description: "Route planning and live coordination to keep every shipment on schedule.",
    icon: "Clock",
  },
  {
    title: "Experienced Drivers",
    description: "Licensed, vetted drivers who know the routes and handle cargo with care.",
    icon: "UserCheck",
  },
  {
    title: "Safe Transportation",
    description: "Well-maintained vehicles and secure loading practices, every trip.",
    icon: "Lock",
  },
  {
    title: "Transparent Communication",
    description: "Clear pricing and real updates from booking to delivery — no surprises.",
    icon: "MessageSquare",
  },
] as const;

export const services = [
  {
    slug: "full-truckload",
    name: "Full Truckload (FTL)",
    description: "Dedicated vehicle for your cargo, ideal for large or time-sensitive loads.",
    icon: "Truck",
  },
  {
    slug: "part-load",
    name: "Part Load (LTL)",
    description: "Share space and cost on shared routes without compromising on care.",
    icon: "PackageSearch",
  },
  {
    slug: "warehousing",
    name: "Warehousing & Storage",
    description: "Secure short and long-term storage with organized inventory handling.",
    icon: "Warehouse",
  },
  {
    slug: "express",
    name: "Express Delivery",
    description: "Priority dispatch for urgent shipments that can't wait.",
    icon: "Zap",
  },
  {
    slug: "intercity",
    name: "Intercity Freight",
    description: "Scheduled long-haul routes connecting major cities and industrial hubs.",
    icon: "Map",
  },
  {
    slug: "packing-loading",
    name: "Packing & Loading",
    description: "Professional packing and careful loading to keep goods damage-free.",
    icon: "PackageCheck",
  },
] as const;

export const fleet = [
  {
    slug: "mini-truck",
    type: "Mini Truck",
    capacity: "Up to 750 kg",
    description: "Best for small city deliveries and tight-access locations.",
    illustration: "mini-truck",
  },
  {
    slug: "pickup",
    type: "Pickup Van",
    capacity: "Up to 1.5 tonnes",
    description: "Versatile choice for retail and local business deliveries.",
    illustration: "pickup",
  },
  {
    slug: "medium-truck",
    type: "Medium Truck (14 ft)",
    capacity: "Up to 4 tonnes",
    description: "A solid mid-size option for intercity part-loads.",
    illustration: "medium-truck",
  },
  {
    slug: "container-truck",
    type: "Container Truck (32 ft)",
    capacity: "Up to 9 tonnes",
    description: "High-capacity hauling for full truckload freight.",
    illustration: "container-truck",
  },
] as const;

export const howItWorks = [
  {
    step: 1,
    title: "Request a Quote",
    description: "Share pickup, delivery, and load details — takes under a minute.",
    icon: "FileText",
  },
  {
    step: 2,
    title: "Confirm Booking",
    description: "We confirm pricing and schedule; you approve and lock it in.",
    icon: "CheckCircle2",
  },
  {
    step: 3,
    title: "Vehicle Assigned",
    description: "A vetted driver and vehicle are assigned to your shipment.",
    icon: "Truck",
  },
  {
    step: 4,
    title: "Delivery",
    description: "Your cargo is delivered on schedule, with confirmation.",
    icon: "PackageCheck",
  },
] as const;

export const serviceAreas = [
  "Jaipur",
  "Delhi NCR",
  "Ahmedabad",
  "Mumbai",
  "Pune",
  "Indore",
  "Udaipur",
  "Jodhpur",
  "Surat",
  "Chandigarh",
  "Lucknow",
  "Kota",
] as const;

export const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Owner, Sharma Textiles",
    rating: 5,
    review:
      "Our shipments have been consistently on time for over a year now. Booking is quick and the drivers always keep us updated.",
  },
  {
    name: "Ayesha Khan",
    role: "Operations Lead, BuildRight Materials",
    rating: 5,
    review:
      "Switched to Transport Co. for our intercity freight and haven't looked back. Transparent pricing, no last-minute surprises.",
  },
  {
    name: "Vikram Patel",
    role: "Founder, Patel Wholesale",
    rating: 4,
    review:
      "Reliable for our regular part-load shipments. Support responds fast on WhatsApp whenever we need an update.",
  },
] as const;

export const vehicleTypeOptions = [
  { value: "mini-truck", label: "Mini Truck" },
  { value: "pickup", label: "Pickup Van" },
  { value: "medium-truck", label: "Medium Truck (14 ft)" },
  { value: "container-truck", label: "Container Truck (32 ft)" },
] as const;