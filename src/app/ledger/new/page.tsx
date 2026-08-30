import { BackLink, PageBody } from "@/components/domain/page-parts";
import { LedgerManualForm } from "@/components/forms/ledger-manual-form";

export default function LedgerManualPage() {
  return (
    <PageBody>
      <BackLink />
      <LedgerManualForm />
    </PageBody>
  );
}
