import type { Metadata } from "next";
import { HandCoins } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <EmptyModulePage
      eyebrow="Pending balance foundation"
      title="Payments"
      message="Payments will show pending, overdue, partial, paid, and disputed balances."
      icon={HandCoins}
      futurePoints={[
        "Record invoices, payments, adjustments, and refunds.",
        "Connect every amount to the right project and client.",
        "Turn due dates and payment status into clear next actions.",
      ]}
    />
  );
}
