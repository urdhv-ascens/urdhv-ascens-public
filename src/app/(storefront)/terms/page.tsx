import { LegalContent } from '@/components/legal/LegalContent';

export const metadata = {
  title: 'Terms of Service | Ūrdhv Ascens',
  description: 'Terms of service governing studio engagements, intellectual property, and educational booklet access.'
};

export default function TermsPage() {
  return <LegalContent policyKey="termsAndConditions" iconType="file" />;
}
