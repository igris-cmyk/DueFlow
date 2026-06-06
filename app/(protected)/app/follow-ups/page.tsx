import type { Metadata } from "next";
import { ListTodo } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Follow-Ups",
};

export default function FollowUpsPage() {
  return (
    <EmptyModulePage
      eyebrow="Action foundation"
      title="Follow-Ups"
      message="Follow-up automation comes after the core ledger. Use Today’s Cash Desk for real pending and overdue project balances now."
      icon={ListTodo}
      futurePoints={[
        "Use real clients, projects, and balances as the source for future follow-ups.",
        "Keep phone, email, WhatsApp, and in-person workflows outside Phase 3.",
        "Tie each future follow-up to its client, project, and payment record.",
      ]}
    />
  );
}
