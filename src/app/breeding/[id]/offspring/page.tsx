import { notFound } from "next/navigation";

import { PageBody } from "@/components/domain/page-parts";
import { OffspringBulkForm } from "@/components/forms/offspring-bulk-form";
import { breedingPlans } from "@/lib/mock/data";

export function generateStaticParams() {
  return breedingPlans.map((p) => ({ id: p.id }));
}

/** 出産日と頭数。繁殖実施の記録から取れる想定だが、モックでは固定値を持つ */
const BIRTH_INFO: Record<string, { bornOn: Date; expectedCount: number }> = {
  bp1: { bornOn: new Date(2026, 9, 1), expectedCount: 4 },
  bp2: { bornOn: new Date(2026, 9, 20), expectedCount: 4 },
};

export default async function OffspringBulkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = breedingPlans.find((p) => p.id === id);
  const birthInfo = BIRTH_INFO[id];
  if (!plan || !birthInfo) {
    notFound();
  }

  return (
    <PageBody>
      <OffspringBulkForm
        planId={plan.id}
        pairLabel={plan.pair.replace("（外部種オス）", "")}
        bornOn={birthInfo.bornOn}
        expectedCount={birthInfo.expectedCount}
      />
    </PageBody>
  );
}
