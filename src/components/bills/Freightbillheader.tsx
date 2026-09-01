import Image from "next/image";

/**
 * Static company letterhead — matches the printed "Umashakti Transport Service"
 * bill exactly. Pull these into env/config constants if you'll ever run this
 * for more than one branch/company.
 */
export function FreightBillHeader() {
  return (
    <div className="border-b-2 border-slate-900 pb-3">
      <p className="text-center text-xs italic tracking-wide text-slate-500">
        Subject to Vadodara Jurisdiction
      </p>

      <div className="mt-1 flex items-center justify-center gap-4">
        <Image
          src="/media/UTS-short-logo.png"
          alt="UMASHAKTI TRANSPORT SERVICE"
          width={72}
          height={72}
          priority
          className="shrink-0"
        />
        <h1 className="text-center text-4xl font-bold tracking-wide text-slate-900">
          Umashakti Transport Service
        </h1>
      </div>

      <p className="mt-1 text-center text-sm text-slate-700">
        Plot No 104/A Siddhi Ind. Park Waghodia Vadodara Gujarat &ndash; 391760
      </p>
      <p className="text-center text-sm text-slate-700">
        E-Mail - umashakti.brd@gmail.com&nbsp;&nbsp;&nbsp;Mob. 9558008708, 9662820706
      </p>

      <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-800">
        <span>PAN NO: AAHFU8816H</span>
        <span>GSTIN: 24AAHFU8816H1ZX</span>
        <span>UDYAM-GJ-24-0106951</span>
      </div>

      <div className="mt-3 flex items-center justify-between bg-slate-800 px-4 py-2 text-base font-bold tracking-wide text-white">
        <span>FREIGHT BILL</span>
        <span>HSN / SAC CODE: - 9965</span>
      </div>
    </div>
  );
}