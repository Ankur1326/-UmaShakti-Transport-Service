export interface CustomerRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  mobile: string;
  email: string;
}

export const MOCK_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust_001",
    name: "Spicehealth Healthcare Pvt Ltd",
    address: "Spaceblack Adsorbents Pvt Ltd, Opp. Alhad Pura Chilling Centre, Alhad Pura",
    city: "Baddi",
    state: "Himachal Pradesh",
    pincode: "173205",
    gstin: "24AABMCS8123F1Z3",
    mobile: "9876543210",
    email: "accounts@spicehealth.com",
  },
  {
    id: "cust_002",
    name: "Abhytech Energycon Limited",
    address: "Plot No. 9, Industrial Area, Lodhi Majra, Tehsil Baddi",
    city: "Solan",
    state: "Himachal Pradesh",
    pincode: "173205",
    gstin: "02AABCA3856C1Z8",
    mobile: "9412345678",
    email: "logistics@abhytech.com",
  },
  {
    id: "cust_003",
    name: "ABC Logistics Pvt Ltd",
    address: "45 Transport Nagar, Sanganer",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302029",
    gstin: "08AABCA1234B1Z5",
    mobile: "9887766554",
    email: "ops@abclogistics.in",
  },
  {
    id: "cust_004",
    name: "XYZ Industries",
    address: "Sector 7, MIA",
    city: "Alwar",
    state: "Rajasthan",
    pincode: "301030",
    gstin: "08AAACX5678C1Z2",
    mobile: "9001122334",
    email: "purchase@xyzind.com",
  },
];

export interface BranchRecord {
  id: string;
  location: string;
  branch: string;
  state: string;
  gstin: string;
}

export const MOCK_BRANCHES: BranchRecord[] = [
  { id: "br_001", location: "Baddi", branch: "Baddi Branch Office", state: "Himachal Pradesh", gstin: "02AAHFU8816H1Z2" },
  { id: "br_002", location: "Solan", branch: "Solan Delivery Office", state: "Himachal Pradesh", gstin: "02AAHFU8816H1Z2" },
  { id: "br_003", location: "Jaipur", branch: "Jaipur Head Office", state: "Rajasthan", gstin: "08AAHFU8816H1Z2" },
  { id: "br_004", location: "Vadodara", branch: "Vadodara Branch", state: "Gujarat", gstin: "24AAHFU8816H1Z2" },
  { id: "br_005", location: "Chandigarh", branch: "Chandigarh Branch", state: "Chandigarh", gstin: "04AAHFU8816H1Z2" },
];