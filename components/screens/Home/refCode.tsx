'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type ReferCodeTypes ={
  setReferralCode: (value: string) => void;
}

const refCode = ({ setReferralCode }: ReferCodeTypes) => {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref) {
      localStorage.setItem('referralCode', ref);
      setReferralCode(ref)
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