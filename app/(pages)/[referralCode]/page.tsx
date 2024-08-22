
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DynamicRedirectPage = ({ params }: { params: { referralCode: string } }) => {
  const { referralCode } = params;
  const router = useRouter();

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);

      router.push('/home');
    }
  }, [referralCode, router]);

  return null; 
};

export default DynamicRedirectPage;
