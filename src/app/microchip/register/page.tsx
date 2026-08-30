import { BackLink, PageBody } from "@/components/domain/page-parts";
import { ChipRegisterForm } from "@/components/forms/chip-register-form";

export default function ChipRegisterPage() {
  return (
    <PageBody>
      <BackLink />
      <ChipRegisterForm />
    </PageBody>
  );
}
