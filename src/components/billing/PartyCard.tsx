"use client";

import { useFormContext } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/ui/Combobox";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import type { BillingFormValues } from "@/lib/validations/billing";

interface PartyCardProps {
  prefix: "consignor" | "consignee";
  title: string;
  description: string;
}

export function PartyCard({ prefix, title, description }: PartyCardProps) {
  const {
    register,
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const sectionErrors = errors[prefix];

  const handleAddNew = () => {
    resetField(`${prefix}.customerId`, { defaultValue: "" });
    resetField(`${prefix}.name`, { defaultValue: "" });
    resetField(`${prefix}.address`, { defaultValue: "" });
    resetField(`${prefix}.city`, { defaultValue: "" });
    resetField(`${prefix}.state`, { defaultValue: "" });
    resetField(`${prefix}.pincode`, { defaultValue: "" });
    resetField(`${prefix}.gstin`, { defaultValue: "" });
    resetField(`${prefix}.mobile`, { defaultValue: "" });
    resetField(`${prefix}.email`, { defaultValue: "" });
  };

  return (
    <FormSection title={title} description={description}>
      <div className="space-y-4">
        <Combobox
          label="Select existing customer"
          placeholder="Search customer…"
          items={MOCK_CUSTOMERS.map((c) => ({ id: c.id, label: c.name, subLabel: `${c.city}, ${c.state}` }))}
          onSelect={(item) => {
            const customer = MOCK_CUSTOMERS.find((c) => c.id === item.id);
            if (!customer) return;
            setValue(`${prefix}.customerId`, customer.id);
            setValue(`${prefix}.name`, customer.name, { shouldValidate: true });
            setValue(`${prefix}.address`, customer.address, { shouldValidate: true });
            setValue(`${prefix}.city`, customer.city);
            setValue(`${prefix}.state`, customer.state);
            setValue(`${prefix}.pincode`, customer.pincode);
            setValue(`${prefix}.gstin`, customer.gstin);
            setValue(`${prefix}.mobile`, customer.mobile, { shouldValidate: true });
            setValue(`${prefix}.email`, customer.email);
          }}
          onCreateNew={handleAddNew}
          createNewLabel="+ Add New Customer"
        />

        <Input label="Company / Customer Name" required error={sectionErrors?.name?.message} {...register(`${prefix}.name`)} />
        <Input label="Address" required error={sectionErrors?.address?.message} {...register(`${prefix}.address`)} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="City" error={sectionErrors?.city?.message} {...register(`${prefix}.city`)} />
          <Input label="State" error={sectionErrors?.state?.message} {...register(`${prefix}.state`)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="PIN Code" error={sectionErrors?.pincode?.message} {...register(`${prefix}.pincode`)} />
          <Input label="GSTIN" error={sectionErrors?.gstin?.message} {...register(`${prefix}.gstin`)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Mobile Number" required error={sectionErrors?.mobile?.message} {...register(`${prefix}.mobile`)} />
          <Input type="email" label="Email" error={sectionErrors?.email?.message} {...register(`${prefix}.email`)} />
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="focus-ring inline-flex items-center gap-1.5 text-body-sm font-medium text-brand-700 hover:text-brand-800"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Add as new customer
        </button>
      </div>
    </FormSection>
  );
}