import { notFound } from "next/navigation";

import { BackLink, NoticeBar, PageBody } from "@/components/domain/page-parts";
import { SaleForm } from "@/components/forms/sale-form";
import { evaluateCompliance } from "@/lib/domain/compliance";
import { animals, findAnimal, TODAY } from "@/lib/mock/data";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
}

export default async function AnimalSellPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = findAnimal(id);
  if (!animal) {
    notFound();
  }

  const compliance = evaluateCompliance({
    birthDate: animal.birthDate,
    chipStatus: animal.chipStatus,
    today: TODAY,
    status: animal.category === "sold" ? "sold" : undefined,
  });

  if (!compliance.isSellable) {
    return (
      <PageBody>
        <BackLink href={`/animals/${animal.id}`} label="個体カルテ" />
        <NoticeBar
          tone="destructive"
          title="この個体はまだ販売登録できません"
          description={
            <ul className="list-disc space-y-1 pl-4">
              {compliance.violations.map((v) => (
                <li key={v.rule}>{v.message}</li>
              ))}
            </ul>
          }
        />
      </PageBody>
    );
  }

  return (
    <PageBody>
      <BackLink href={`/animals/${animal.id}`} label="個体カルテ" />
      <SaleForm animalId={animal.id} callName={animal.callName} />
    </PageBody>
  );
}
