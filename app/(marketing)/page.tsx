import { CashDeskSection } from "@/components/marketing/cash-desk-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { FollowUpSection } from "@/components/marketing/follow-up-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ProductSystemSection } from "@/components/marketing/product-system-section";
import { ProofVaultSection } from "@/components/marketing/proof-vault-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { WebMobileSection } from "@/components/marketing/web-mobile-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ProductSystemSection />
      <CashDeskSection />
      <ProofVaultSection />
      <FollowUpSection />
      <WebMobileSection />
      <UseCasesSection />
      <PricingSection />
      <TrustSection />
      <FinalCta />
    </>
  );
}
