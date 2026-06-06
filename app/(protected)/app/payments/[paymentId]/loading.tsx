import { AppLoadingState } from "@/components/app/app-loading-state";

export default function PaymentDetailLoading() {
  return <AppLoadingState title="Loading payment" rows={2} />;
}
