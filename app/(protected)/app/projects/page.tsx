import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <EmptyModulePage
      eyebrow="Work-to-money foundation"
      title="Projects"
      message="Projects will connect work value, payment status, proof, promises, and follow-ups."
      icon={FolderKanban}
      futurePoints={[
        "Track total value, paid amount, and pending amount together.",
        "Keep due dates, payment terms, and risk status visible.",
        "Link every project to its client and organization boundary.",
      ]}
    />
  );
}
