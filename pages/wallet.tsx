'use client';

import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { Account, Wallet } from '~/components/screens';

const wallet = () => {
    const { address } = useAccount();
    const { data: balanceInfo } = useBalance({ address });
    const ethBalance = Number(formatEther(balanceInfo?.value || 0n));
  
  
    return (
      <div
       style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}>
        {address ? (
          <Wallet balanceInETH={ethBalance.toFixed(4)} />
          
        ) : (
          <Account balanceInETH={ethBalance.toFixed(4)} />
        )}
      </div>
    );
  };

export default wallet;
