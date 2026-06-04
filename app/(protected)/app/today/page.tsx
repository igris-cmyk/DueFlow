import type { Metadata } from "next";
import { TodayEmptyState } from "@/components/app/today-empty-state";

export const metadata: Metadata = {
  title: "Today’s Cash Desk",
};

export default function TodayPage() {
  return <TodayEmptyState />;
}
