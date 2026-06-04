import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import { UseCaseDetail } from "@/components/marketing/use-case-detail";
import { getUseCase, useCases } from "@/lib/use-cases";

type UseCasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    return {};
  }

  const title = `DueFlow for ${useCase.name} — Track Pending Payments and Proof`;
  const description = `${useCase.shortDescription} See how DueFlow keeps proof, promises, balances, and follow-ups clear.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow={`DueFlow for ${useCase.name}`}
        title={useCase.heroTitle}
        description={useCase.shortDescription}
        secondaryLabel="View All Use Cases"
        secondaryHref="/use-cases"
      />
      <UseCaseDetail useCase={useCase} />
    </>
  );
}
