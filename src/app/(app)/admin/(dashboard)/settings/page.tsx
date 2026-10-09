"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Building2, Check, CreditCard, FileText, Hash, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import {
  DEFAULT_COMPANY_SETTINGS,
  LR_FORMATS,
  type CompanySettingsResponse,
  type LRFormat,
  type CompanySettingsValues,
} from "@/lib/company-settings";

const TABS = [
  { id: "company", label: "Company Account", icon: Building2 },
  { id: "payments", label: "Payment Integration", icon: CreditCard },
  { id: "documents", label: "Document Settings", icon: FileText },
  { id: "numbering", label: "Consignment Settings", icon: Hash },
] as const;

type TabId = (typeof TABS)[number]["id"];
type TextSettingKey = Exclude<keyof CompanySettingsValues, "consignmentStartNumber" | "accountType" | "lrFormat" | "lrFormatBackgrounds">;
type ImageSettingKey = "companyLogo" | "signature" | "upiQrCode";

const LR_FORMAT_OPTIONS: Record<LRFormat, { name: string; description: string }> = {
  classic: { name: "Classic", description: "Traditional bordered LR with a balanced information layout." },
  modern: { name: "Modern", description: "A clean company-forward design with prominent route and parties." },
  compact: { name: "Compact", description: "Tighter spacing for a concise, information-dense printed LR." },
};

function Field({
  label,
  children,
  required = false,
  helper,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-1 text-red-600">*</span>}
      </span>
      {children}
      {helper && <span className="block text-xs text-slate-500">{helper}</span>}
    </label>
  );
}

const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

async function readImageFile(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  }
  if (file.size > 256 * 1024) {
    throw new Error("Each image must be no larger than 256 KB.");
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Unable to read the selected image"));
    };
    reader.onerror = () => reject(new Error("Unable to read the selected image"));
    reader.readAsDataURL(file);
  });
}

function ImageSetting({
  title,
  description,
  value,
  onChange,
  onRemove,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
        {value ? (
          <img src={value} alt={title} className="h-full w-full object-contain" />
        ) : (
          <ImagePlus className="h-8 w-8 text-slate-400" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <p className="mt-1 text-xs text-slate-500">PNG, JPEG, or WebP; maximum 256 KB.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="focus-ring inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={onChange}
            />
          </label>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettingsValues>(DEFAULT_COMPANY_SETTINGS);
  const [activeTab, setActiveTab] = useState<TabId>("company");
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings", { cache: "no-store" });
        const result = (await response.json()) as CompanySettingsResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Unable to load company settings");
        }
        if (!cancelled) {
          setSettings({
            ...DEFAULT_COMPANY_SETTINGS,
            ...result.data,
            lrFormatBackgrounds: {
              ...DEFAULT_COMPANY_SETTINGS.lrFormatBackgrounds,
              ...result.data.lrFormatBackgrounds,
            },
          });
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load company settings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateText(field: TextSettingKey, value: string) {
    setSettings((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  }

  async function handleImageChange(field: ImageSettingKey, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await readImageFile(file);
      setSettings((current) => ({ ...current, [field]: dataUrl }));
      setErrorMessage("");
      setSavedMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to read the selected image");
    }
  }

  async function handleLRBackgroundChange(format: LRFormat, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const backgroundImage = await readImageFile(file);
      setSettings((current) => ({
        ...current,
        lrFormatBackgrounds: {
          ...current.lrFormatBackgrounds,
          [format]: { ...current.lrFormatBackgrounds[format], backgroundImage },
        },
      }));
      setErrorMessage("");
      setSavedMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to read the selected image");
    }
  }

  function updateLRBackgroundColor(format: LRFormat, backgroundColor: string) {
    setSettings((current) => ({
      ...current,
      lrFormatBackgrounds: {
        ...current.lrFormatBackgrounds,
        [format]: { ...current.lrFormatBackgrounds[format], backgroundColor },
      },
    }));
    setSavedMessage("");
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSavedMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await response.json()) as CompanySettingsResponse;
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Unable to save company settings");
      }
      setSettings({
        ...DEFAULT_COMPANY_SETTINGS,
        ...result.data,
        lrFormatBackgrounds: {
          ...DEFAULT_COMPANY_SETTINGS.lrFormatBackgrounds,
          ...result.data.lrFormatBackgrounds,
        },
      });
      setSavedMessage("Settings saved successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save company settings");
    } finally {
      setSaving(false);
    }
  }

  const currentTab = TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Workspace configuration</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Company Settings</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Configure your company profile, payment details, document defaults, and consignment numbering.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-2 lg:grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setActiveTab(id);
              setErrorMessage("");
              setSavedMessage("");
            }}
            aria-current={activeTab === id ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === id
                ? "bg-brand-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={saveSettings} className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-950">{currentTab?.label}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "company" && "Business contact details and company identity used throughout the workspace."}
              {activeTab === "payments" && "Bank and UPI details displayed on your documents. Gateway processing is not enabled."}
              {activeTab === "documents" && "Default terms displayed on invoices, quotations, and lorry receipts."}
              {activeTab === "numbering" && "Set the minimum starting number for new consignments."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading settings…
            </div>
          ) : (
            <>
              {activeTab === "company" && (
                <div className="space-y-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your Company Name" required>
                      <input className={inputClassName} value={settings.companyName} maxLength={160} required onChange={(e) => updateText("companyName", e.target.value)} />
                    </Field>
                    <Field label="Company GST No.">
                      <input className={inputClassName} value={settings.gstNumber} maxLength={15} autoCapitalize="characters" placeholder="15-character GSTIN" onChange={(e) => updateText("gstNumber", e.target.value.toUpperCase())} />
                    </Field>
                    <Field label="1st Mobile Number" required>
                      <input className={inputClassName} type="tel" value={settings.mobile1} maxLength={30} required onChange={(e) => updateText("mobile1", e.target.value)} />
                    </Field>
                    <Field label="2nd Mobile Number" required>
                      <input className={inputClassName} type="tel" value={settings.mobile2} maxLength={30} required onChange={(e) => updateText("mobile2", e.target.value)} />
                    </Field>
                    <Field label="Company Email Id" required>
                      <input className={inputClassName} type="email" value={settings.email} maxLength={254} required onChange={(e) => updateText("email", e.target.value)} />
                    </Field>
                    <Field label="Company Website">
                      <input className={inputClassName} type="url" value={settings.website} maxLength={2048} placeholder="https://example.com" onChange={(e) => updateText("website", e.target.value)} />
                    </Field>
                    <Field label="Address Line" required>
                      <input className={inputClassName} value={settings.addressLine} maxLength={300} required onChange={(e) => updateText("addressLine", e.target.value)} />
                    </Field>
                    <Field label="Country">
                      <input className={inputClassName} value={settings.country} maxLength={100} onChange={(e) => updateText("country", e.target.value)} />
                    </Field>
                    <Field label="State">
                      <input className={inputClassName} value={settings.state} maxLength={100} onChange={(e) => updateText("state", e.target.value)} />
                    </Field>
                    <Field label="City">
                      <input className={inputClassName} value={settings.city} maxLength={100} onChange={(e) => updateText("city", e.target.value)} />
                    </Field>
                    <Field label="Pin / Zip Code" required>
                      <input className={inputClassName} value={settings.pinCode} maxLength={20} required onChange={(e) => updateText("pinCode", e.target.value)} />
                    </Field>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">Company identity</h4>
                      <p className="mt-1 text-sm text-slate-500">Images are stored with your account and used on generated documents.</p>
                    </div>
                    <ImageSetting
                      title="Company Logo"
                      description="Shown in the company header and printed documents."
                      value={settings.companyLogo}
                      onChange={(event) => void handleImageChange("companyLogo", event)}
                      onRemove={() => updateText("companyLogo", "")}
                    />
                    <ImageSetting
                      title="Authorized Signature"
                      description="Shown on invoice and LR printouts."
                      value={settings.signature}
                      onChange={(event) => void handleImageChange("signature", event)}
                      onRemove={() => updateText("signature", "")}
                    />
                  </div>
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Account Holder Name">
                      <input className={inputClassName} value={settings.accountHolderName} maxLength={160} onChange={(e) => updateText("accountHolderName", e.target.value)} />
                    </Field>
                    <Field label="Name of Bank">
                      <input className={inputClassName} value={settings.bankName} maxLength={160} onChange={(e) => updateText("bankName", e.target.value)} />
                    </Field>
                    <Field label="Account Number">
                      <input className={inputClassName} value={settings.accountNumber} maxLength={34} autoComplete="off" onChange={(e) => updateText("accountNumber", e.target.value)} />
                    </Field>
                    <Field label="IFSC Code">
                      <input className={inputClassName} value={settings.ifscCode} maxLength={11} autoCapitalize="characters" onChange={(e) => updateText("ifscCode", e.target.value.toUpperCase())} />
                    </Field>
                    <Field label="Bank Branch">
                      <input className={inputClassName} value={settings.bankBranch} maxLength={160} onChange={(e) => updateText("bankBranch", e.target.value)} />
                    </Field>
                    <Field label="Account Type">
                      <select
                        className={inputClassName}
                        value={settings.accountType}
                        onChange={(e) => setSettings((current) => ({ ...current, accountType: e.target.value as CompanySettingsValues["accountType"] }))}
                      >
                        <option value="Current">Current</option>
                        <option value="Saving">Saving</option>
                        <option value="Others">Others</option>
                      </select>
                    </Field>
                    {settings.accountType === "Others" && (
                      <Field label="Specify Account Type">
                        <input className={inputClassName} value={settings.otherAccountType} maxLength={80} onChange={(e) => updateText("otherAccountType", e.target.value)} />
                      </Field>
                    )}
                    <Field label="UPI Id">
                      <input className={inputClassName} value={settings.upiId} maxLength={100} placeholder="company@bank" onChange={(e) => updateText("upiId", e.target.value)} />
                    </Field>
                  </div>
                  <ImageSetting
                    title="UPI QR Code"
                    description="Display your payment QR code on printed documents."
                    value={settings.upiQrCode}
                    onChange={(event) => void handleImageChange("upiQrCode", event)}
                    onRemove={() => updateText("upiQrCode", "")}
                  />
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    Bank and UPI details are document settings only. A payment gateway is not connected yet.
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">Lorry Receipt format</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Choose the default design used in consignment preview, printing and PDF download.
                      </p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {LR_FORMATS.map((format) => {
                        const selected = settings.lrFormat === format;
                        const background = settings.lrFormatBackgrounds[format];
                        return (
                          <section
                            key={format}
                            className={`overflow-hidden rounded-xl border ${selected ? "border-brand-600 ring-2 ring-brand-100" : "border-slate-200"}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSettings((current) => ({ ...current, lrFormat: format }));
                                setSavedMessage("");
                              }}
                              aria-pressed={selected}
                              className="block w-full p-3 text-left"
                            >
                              <div
                                className={`relative flex h-28 flex-col gap-2 overflow-hidden rounded-lg border border-slate-300 p-2 ${format === "modern" ? "border-t-4 border-t-brand-600" : ""}`}
                                style={{
                                  backgroundColor: background.backgroundColor,
                                  backgroundImage: background.backgroundImage
                                    ? `linear-gradient(rgba(255,255,255,.72),rgba(255,255,255,.72)),url("${background.backgroundImage}")`
                                    : undefined,
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }}
                              >
                                <div className="flex items-center justify-between border-b border-slate-400 pb-1">
                                  <span className="text-[9px] font-bold uppercase text-slate-800">Company Name</span>
                                  <span className="text-[8px] font-semibold text-slate-700">LR No. 2051</span>
                                </div>
                                <div className="grid flex-1 grid-cols-2 gap-1">
                                  <div className="rounded border border-slate-400/70 p-1 text-[7px] text-slate-700">Consignor<br />Address / GSTIN</div>
                                  <div className="rounded border border-slate-400/70 p-1 text-[7px] text-slate-700">Consignee<br />Address / GSTIN</div>
                                  <div className="col-span-2 rounded border border-slate-400/70 p-1 text-[7px] text-slate-700">Route · Goods · Charges</div>
                                </div>
                              </div>
                              <span className="mt-3 flex items-center justify-between gap-2">
                                <span>
                                  <span className="block text-sm font-semibold text-slate-900">{LR_FORMAT_OPTIONS[format].name}</span>
                                  <span className="mt-0.5 block text-xs text-slate-500">{LR_FORMAT_OPTIONS[format].description}</span>
                                </span>
                                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${selected ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                                  {selected ? "Selected" : "Select"}
                                </span>
                              </span>
                            </button>
                            <div className="space-y-3 border-t border-slate-100 bg-slate-50 p-3">
                              <Field label={`${LR_FORMAT_OPTIONS[format].name} background color`}>
                                <span className="flex items-center gap-3">
                                  <input
                                    aria-label={`${LR_FORMAT_OPTIONS[format].name} background color`}
                                    type="color"
                                    value={background.backgroundColor}
                                    onChange={(event) => updateLRBackgroundColor(format, event.target.value)}
                                    className="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-white p-1"
                                  />
                                  <span className="text-xs font-medium uppercase text-slate-600">{background.backgroundColor}</span>
                                </span>
                              </Field>
                              <div>
                                <p className="mb-1.5 text-sm font-medium text-slate-700">Background image</p>
                                {background.backgroundImage && (
                                  <img
                                    src={background.backgroundImage}
                                    alt={`${LR_FORMAT_OPTIONS[format].name} background preview`}
                                    className="mb-2 h-16 w-full rounded border border-slate-200 object-cover"
                                  />
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <label className="focus-ring inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Choose image
                                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => void handleLRBackgroundChange(format, event)} />
                                  </label>
                                  {background.backgroundImage && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSettings((current) => ({
                                          ...current,
                                          lrFormatBackgrounds: {
                                            ...current.lrFormatBackgrounds,
                                            [format]: { ...current.lrFormatBackgrounds[format], backgroundImage: "" },
                                          },
                                        }));
                                        setSavedMessage("");
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                <p className="mt-1 text-xs text-slate-500">PNG, JPEG or WebP; maximum 256 KB. Saved independently for this format.</p>
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    For printed backgrounds, enable “Background graphics” in your browser&apos;s print dialog.
                  </p>
                  <Field label="Default Invoice Terms And Conditions" helper="These terms appear on freight bills / invoices.">
                    <textarea className={`${inputClassName} min-h-32 py-2`} rows={5} maxLength={10000} value={settings.invoiceTerms} onChange={(e) => updateText("invoiceTerms", e.target.value)} />
                  </Field>
                  <Field label="Default Quotation Terms And Conditions">
                    <textarea className={`${inputClassName} min-h-32 py-2`} rows={5} maxLength={10000} value={settings.quotationTerms} onChange={(e) => updateText("quotationTerms", e.target.value)} />
                  </Field>
                  <Field label="Default LR Terms And Conditions" helper="Shown on lorry receipt printouts.">
                    <textarea className={`${inputClassName} min-h-32 py-2`} rows={5} maxLength={10000} value={settings.lrTerms} onChange={(e) => updateText("lrTerms", e.target.value)} />
                  </Field>
                </div>
              )}

              {activeTab === "numbering" && (
                <div className="max-w-xl space-y-4">
                  <Field
                    label="Consignment Starting Number"
                    required
                    helper="The next number is the greater of this value or the highest existing numeric consignment number plus one."
                  >
                    <input
                      className={inputClassName}
                      type="number"
                      min={1}
                      max={999999999999}
                      step={1}
                      value={settings.consignmentStartNumber}
                      required
                      onChange={(e) => setSettings((current) => ({
                        ...current,
                        consignmentStartNumber: Number(e.target.value),
                      }))}
                    />
                  </Field>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Existing consignment numbers will not be reused when this starting number changes.
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {!isLoading && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite">
              {errorMessage && <p className="text-sm font-medium text-red-700">{errorMessage}</p>}
              {savedMessage && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {savedMessage}
                </p>
              )}
            </div>
            <Button type="submit" isLoading={isSaving}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
