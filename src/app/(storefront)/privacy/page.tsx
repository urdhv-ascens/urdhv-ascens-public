import { LegalContent } from '@/components/legal/LegalContent';

export const metadata = {
  title: 'Privacy Policy | Ūrdhv Ascens',
  description: 'Our privacy standards, visitor data protection policy, and learning progress logging practices.'
};

export default function PrivacyPolicyPage() {
  return <LegalContent policyKey="privacyPolicy" iconType="shield" />;
}
