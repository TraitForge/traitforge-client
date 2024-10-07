import { redirect } from 'next/navigation';

export default function ReferralRedirectPage({ params }: { params: { referralCode: string } }) {
  const { referralCode } = params;

  redirect(`/home?ref=${referralCode}`);
}
