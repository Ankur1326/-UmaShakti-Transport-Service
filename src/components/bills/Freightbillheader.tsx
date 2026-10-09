import type { CompanySettingsValues } from "@/lib/company-settings";

export function FreightBillHeader({ company }: { company: CompanySettingsValues }) {
  const companyAddress = [
    company.addressLine,
    company.city,
    company.state,
    company.pinCode,
    company.country,
  ].filter(Boolean).join(", ");
  const phones = [company.mobile1, company.mobile2].filter(Boolean).join(", ");

  return (
    <div className="">
      <p className="text-center text-xs italic tracking-wide text-slate-500">
        Subject to Vadodara Jurisdiction
      </p>

      <div className="mt-1 flex items-center justify-center gap-4">
        {company.companyLogo && (
          <img
            src={company.companyLogo}
            alt={`${company.companyName || "Company"} logo`}
            className="h-[72px] w-[72px] shrink-0 object-contain"
          />
        )}
        <h1 className="text-center text-[26px] font-bold tracking-wide text-[#EF6711] uppercase">
          {company.companyName || "Company Name"}
        </h1>
      </div>

      <p className="mt-1 text-center text-sm text-slate-700 font-semibold">
        {companyAddress}
      </p>
      <p className="text-center text-sm text-slate-700">
        {company.email && <>E-Mail - <span className="underline">{company.email}</span></>}
        {company.email && phones && "   "}
        {phones && <>Mob. {phones}</>}
      </p>

      {company.gstNumber && (
        <div className="mt-2 flex justify-end text-sm font-semibold text-slate-800">
          <span>GSTIN: {company.gstNumber}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between bg-slate-800 px-4 py-2 text-base font-bold tracking-wide text-white">
        <span className=" w-[55%] text-end">FREIGHT BILL</span>
        <span>HSN / SAC CODE: - 9965</span>
      </div>
    </div>
  );
}