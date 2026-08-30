import { PageBody } from "@/components/domain/page-parts";
import { AnimalNewForm } from "@/components/forms/animal-new-form";

export default function AnimalNewPage() {
  return (
    <PageBody className="mx-auto max-w-2xl">
      <AnimalNewForm />
    </PageBody>
  );
}
