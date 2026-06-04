import type { Metadata } from "next";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageHero } from "@/components/marketing/page-hero";
import { UseCaseOverviewList } from "@/components/marketing/use-case-overview-list";
import { UseCasesSection } from "@/components/marketing/use-cases-section";

export const metadata: Metadata = {
  title: {
    absolute:
      "DueFlow Use Cases — Contractors, Freelancers, Agencies, and Service Businesses",
  },
  description:
    "See how DueFlow helps contractors, freelancers, agencies, photographers, repair teams, and interior workers track pending payments, proof, promises, and follow-ups.",
  openGraph: {
    title:
      "DueFlow Use Cases — Contractors, Freelancers, Agencies, and Service Businesses",
    description:
      "See how DueFlow helps contractors, freelancers, agencies, photographers, repair teams, and interior workers track pending payments, proof, promises, and follow-ups.",
  },
};

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Use cases"
        title="Cashflow control for people whose work happens across projects, sites, and client conversations."
        description="DueFlow is designed for businesses where partial payments, proof, promises, and follow-ups need to stay connected long after the work begins."
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
      <UseCasesSection />
      <UseCaseOverviewList />
      <FinalCta />
    </>
  );
}
