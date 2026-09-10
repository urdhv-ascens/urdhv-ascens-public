import { LegalContent } from '@/components/legal/LegalContent';

export const metadata = {
  title: 'Cancellation & Refund Policy | Ūrdhv Ascens',
  description: 'Cancellation, revision, and refund policies for Ūrdhv Ascens bespoke studio services.'
};

export default function RefundPolicyPage() {
  return <LegalContent policyKey="refundPolicy" iconType="refresh" />;
}
