// app/[referralCode]/page.tsx

import { redirect } from 'next/navigation';

export default function DynamicRedirectPage({ params }: { params: { referralCode: string } }) {
  const { referralCode } = params;

  if (typeof window === 'undefined') {
    redirect(`/home?ref=${referralCode}`);
  }

  // On the client side, this would be redundant, so returning null
  return null;
}
