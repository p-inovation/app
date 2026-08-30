import { PageBody } from "@/components/domain/page-parts";
import { PhotoNewForm } from "@/components/forms/photo-new-form";

export default function PhotoNewPage() {
  return (
    <PageBody className="mx-auto max-w-2xl">
      <PhotoNewForm />
    </PageBody>
  );
}
