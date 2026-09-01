import Image from "next/image";

/**
 * Static company letterhead — matches the printed "Umashakti Transport Service"
 * bill exactly. Pull these into env/config constants if you'll ever run this
 * for more than one branch/company.
 */
export function FreightBillHeader() {
  return (
    <div className="">
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
        <h1 className="text-center text-[26px] font-bold tracking-wide text-[#EF6711] uppercase">
          Umashakti Transport Service
        </h1>
      </div>

      <p className="mt-1 text-center text-sm text-slate-700 font-semibold">
        Plot No 104/A Siddhi Ind. Park Waghodia Vadodara Gujarat &ndash; 391760
      </p>
      <p className="text-center text-sm text-slate-700">
        E-Mail - <span className="underline">umashakti.brd@gmail.com</span>&nbsp;&nbsp;&nbsp;Mob. 9558008708, 9662820706
      </p>

      <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-800">
        <span>PAN NO: AAHFU8816H</span>
        <span>GSTIN: 24AAHFU8816H1ZX</span>
        <span> MSME NO: UDYAM-GJ-24-0106951</span>
      </div>

      <div className="mt-3 flex items-center justify-between bg-slate-800 px-4 py-2 text-base font-bold tracking-wide text-white">
        <span className=" w-[55%] text-end">FREIGHT BILL</span>
        <span>HSN / SAC CODE: - 9965</span>
      </div>
    </div>
  );
}