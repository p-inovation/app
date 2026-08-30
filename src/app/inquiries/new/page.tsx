import { BackLink, PageBody } from "@/components/domain/page-parts";
import { InquiryNewForm } from "@/components/forms/inquiry-new-form";

export default function InquiryNewPage() {
  return (
    <PageBody>
      <BackLink />
      <InquiryNewForm />
    </PageBody>
  );
}
