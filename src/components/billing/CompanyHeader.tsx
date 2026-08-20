import { siteConfig } from "@/lib/site-config";

const COMPANY_REGISTRATION = {
  regNo: "24AAHFU8816H1ZX",
  pan: "AAHFU8816H",
  udyam: "UDYAM-GJ-24-0106951",
};

export function CompanyHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-700 bg-white">
          <span className="text-h4 font-bold text-brand-800">UTS</span>
        </div>
        <div>
          <h1 className="text-h3 font-bold uppercase tracking-tight text-brand-800">{siteConfig.name}</h1>
          <p className="text-body-sm text-neutral-500">{siteConfig.address}</p>
          <p className="text-body-sm text-neutral-500">
            {siteConfig.phone} · {siteConfig.email}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-caption text-neutral-600 sm:text-right">
        <div className="flex justify-between gap-2 sm:justify-end">
          <dt className="font-medium text-neutral-500">REG. NO.</dt>
          <dd>{COMPANY_REGISTRATION.regNo}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:justify-end">
          <dt className="font-medium text-neutral-500">PAN</dt>
          <dd>{COMPANY_REGISTRATION.pan}</dd>
        </div>
        <div className="col-span-2 flex justify-between gap-2 sm:justify-end">
          <dt className="font-medium text-neutral-500">UDYAM</dt>
          <dd>{COMPANY_REGISTRATION.udyam}</dd>
        </div>
      </dl>
    </div>
  );
}