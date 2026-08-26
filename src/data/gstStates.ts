export interface GstState {
    code: string;      // e.g. "24"
    stateCode: string; // e.g. "GJ"
    name: string;      // e.g. "GUJARAT"
}

export const GST_STATES: GstState[] = [
    { code: "37", stateCode: "AD", name: "ANDHRA PRADESH" },
    { code: "12", stateCode: "AR", name: "ARUNACHAL PRADESH" },
    { code: "18", stateCode: "AS", name: "ASSAM" },
    { code: "10", stateCode: "BR", name: "BIHAR" },
    { code: "22", stateCode: "CG", name: "CHATTISGARH" },
    { code: "07", stateCode: "DL", name: "DELHI" },
    { code: "30", stateCode: "GA", name: "GOA" },
    { code: "24", stateCode: "GJ", name: "GUJARAT" },
    { code: "06", stateCode: "HR", name: "HARYANA" },
    { code: "02", stateCode: "HP", name: "HIMACHAL PRADESH" },
    { code: "01", stateCode: "JK", name: "JAMMU AND KASHMIR" },
    { code: "20", stateCode: "JH", name: "JHARKHAND" },
    { code: "29", stateCode: "KA", name: "KARNATAKA" },
    { code: "32", stateCode: "KL", name: "KERALA" },
    { code: "31", stateCode: "LD", name: "LAKSHADWEEP ISLANDS" },
    { code: "23", stateCode: "MP", name: "MADHYA PRADESH" },
    { code: "27", stateCode: "MH", name: "MAHARASHTRA" },
    { code: "14", stateCode: "MN", name: "MANIPUR" },
    { code: "17", stateCode: "ML", name: "MEGHALAYA" },
    { code: "15", stateCode: "MZ", name: "MIZORAM" },
    { code: "13", stateCode: "NL", name: "NAGALAND" },
    { code: "21", stateCode: "OD", name: "ODISHA" },
    { code: "34", stateCode: "PY", name: "PONDICHERRY" },
    { code: "03", stateCode: "PB", name: "PUNJAB" },
    { code: "08", stateCode: "RJ", name: "RAJASTHAN" },
    { code: "11", stateCode: "SK", name: "SIKKIM" },
    { code: "33", stateCode: "TN", name: "TAMIL NADU" },
    { code: "36", stateCode: "TS", name: "TELANGANA" },
    { code: "16", stateCode: "TR", name: "TRIPURA" },
    { code: "09", stateCode: "UP", name: "UTTAR PRADESH" },
    { code: "05", stateCode: "UK", name: "UTTARAKHAND" },
    { code: "19", stateCode: "WB", name: "WEST BENGAL" },
];