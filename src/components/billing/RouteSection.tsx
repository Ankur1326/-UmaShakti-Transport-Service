"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/ui/Combobox";
import { MOCK_BRANCHES } from "@/lib/mock-data/customers";
import type { BillingFormValues } from "@/lib/validations/billing";

function RouteColumn({ prefix, title }: { prefix: "from" | "to"; title: string }) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const sectionErrors = errors[prefix];

  return (
    <div className="flex-1 rounded-lg border border-neutral-200 p-4">
      <h3 className="mb-3 text-caption font-semibold uppercase tracking-wide text-brand-700">{title}</h3>
      <div className="space-y-4">
        <Combobox
          label="Search location / branch"
          placeholder="Search by city or branch…"
          items={MOCK_BRANCHES.map((b) => ({ id: b.id, label: b.location, subLabel: b.branch }))}
          onSelect={(item) => {
            const branch = MOCK_BRANCHES.find((b) => b.id === item.id);
            if (!branch) return;
            setValue(`${prefix}.location`, branch.location, { shouldValidate: true });
            setValue(`${prefix}.branch`, branch.branch);
            setValue(`${prefix}.state`, branch.state);
            setValue(`${prefix}.gstin`, branch.gstin);
          }}
        />

        <Input
          label="Location"
          required
          error={sectionErrors?.location?.message}
          {...register(`${prefix}.location`)}
        />
        <Input label="Branch / Office" error={sectionErrors?.branch?.message} {...register(`${prefix}.branch`)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="State" error={sectionErrors?.state?.message} {...register(`${prefix}.state`)} />
          <Input label="GSTIN" error={sectionErrors?.gstin?.message} {...register(`${prefix}.gstin`)} />
        </div>
      </div>
    </div>
  );
}

export function RouteSection() {
  return (
    <FormSection title="Route" description="Origin and destination for this shipment.">
      <div className="flex flex-col gap-4 lg:flex-row">
        <RouteColumn prefix="from" title="From" />
        <RouteColumn prefix="to" title="To" />
      </div>
    </FormSection>
  );
}