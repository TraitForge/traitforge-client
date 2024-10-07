'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const refCode = () => {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref) {
      localStorage.setItem('referralCode', ref);
    }
  }, [ref]);

  return (
    <div>
      {ref && (
      <p>Referral code: "{ref}"</p>
      )}
    </div>
  );
};

export default refCode;