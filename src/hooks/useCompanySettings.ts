"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_COMPANY_SETTINGS,
  type CompanySettingsResponse,
  type CompanySettingsValues,
} from "@/lib/company-settings";

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettingsValues>(DEFAULT_COMPANY_SETTINGS);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
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
        console.error("Unable to load company settings:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, isLoading };
}
