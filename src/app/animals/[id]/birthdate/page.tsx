import { notFound } from "next/navigation";

import { BackLink, PageBody } from "@/components/domain/page-parts";
import { BirthdateRequestForm } from "@/components/forms/birthdate-request-form";
import { animals, findAnimal } from "@/lib/mock/data";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
}

export default async function AnimalBirthdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = findAnimal(id);
  if (!animal) {
    notFound();
  }

  return (
    <PageBody>
      <BackLink href={`/animals/${animal.id}`} label="個体カルテ" />
      <BirthdateRequestForm animalId={animal.id} birthDate={animal.birthDate} />
    </PageBody>
  );
}
