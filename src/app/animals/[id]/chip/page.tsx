import { notFound } from "next/navigation";

import { BackLink, PageBody } from "@/components/domain/page-parts";
import { ChipEditForm } from "@/components/forms/chip-edit-form";
import type { ChipEditInput } from "@/lib/domain/schemas";
import { animals, chipRows, findAnimal } from "@/lib/mock/data";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
}

export default async function AnimalChipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = findAnimal(id);
  if (!animal) {
    notFound();
  }

  const chipRow = chipRows.find((row) => row.animalId === id);

  // chipRows は登録日そのものを持たない（status のみ）ため、
  // 登録日は空で初期化し、ユーザーが入力した値で判定メッセージを出す。
  const defaultValues: ChipEditInput = {
    microchipNo: chipRow?.chipNo?.replace(/[^0-9]/g, "") ?? "",
    microchipImplantedOn: chipRow?.implantedOn ?? "",
    microchipRegisteredOn: "",
    neuterStatus: "unknown",
    rabiesLicenseOn: "",
    rabiesTagNo: "",
  };

  return (
    <PageBody>
      <BackLink href={`/animals/${animal.id}`} label="個体カルテ" />
      <ChipEditForm
        animalId={animal.id}
        callName={animal.callName}
        defaultValues={defaultValues}
      />
    </PageBody>
  );
}
