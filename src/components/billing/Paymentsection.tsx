"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Select } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/Combobox";
import { Input } from "@/components/ui/Input";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import { BILLING_PARTIES, PAYMENT_STATUSES, PAYMENT_TYPES } from "@/lib/validations/billing";
import type { BillingFormValues } from "@/lib/validations/billing";

const toOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

export function PaymentSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const paymentErrors = errors.payment;
  const billingAccount = watch("payment.billingAccount");

  return (
    <FormSection title="Payment / Billing Information" description="How and by whom this consignment will be paid.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Payment Type"
          required
          placeholder="Select payment type"
          options={toOptions(PAYMENT_TYPES)}
          error={paymentErrors?.type?.message}
          {...register("payment.type")}
        />
        <Select
          label="Billing Party"
          options={toOptions(BILLING_PARTIES)}
          error={paymentErrors?.billingParty?.message}
          {...register("payment.billingParty")}
        />

        <div className="sm:col-span-2">
          <Combobox
            label="Billing Account"
            placeholder="Search customer to bill…"
            items={MOCK_CUSTOMERS.map((c) => ({ id: c.id, label: c.name, subLabel: `${c.city}, ${c.state}` }))}
            onSelect={(item) => setValue("payment.billingAccount", item.label)}
          />
          {billingAccount && <Input readOnly value={billingAccount} className="mt-2 bg-neutral-50 text-neutral-600" />}
        </div>

        <Select
          label="Payment Status"
          options={toOptions(PAYMENT_STATUSES)}
          error={paymentErrors?.status?.message}
          {...register("payment.status")}
        />
      </div>
    </FormSection>
  );
}