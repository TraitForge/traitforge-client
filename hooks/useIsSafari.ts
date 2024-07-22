import { useEffect, useState } from 'react';

export const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isSafariBrowser =
        userAgent.includes('safari') && !userAgent.includes('chrome');
      setIsSafari(isSafariBrowser);
    }
  }, []);

  return isSafari;
};