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
      message="Follow-ups will show what needs action today."
      icon={ListTodo}
      futurePoints={[
        "Prioritize respectful next actions by due date and urgency.",
        "Keep phone, email, WhatsApp, and in-person history connected.",
        "Tie each follow-up to its client, project, and payment when relevant.",
      ]}
    />
  );
}
