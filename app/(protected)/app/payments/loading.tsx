import { AppLoadingState } from "@/components/app/app-loading-state";

export default function PaymentsLoading() {
  return <AppLoadingState title="Loading payments" rows={5} />;
}
