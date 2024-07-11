'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { WalletModal } from '~/components/screens';

const WalletButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="walletbackground flex items-center gap-2 p-2 rounded-lg h-10"
                    onClick={openConnectModal}
                  >
                    <FaWallet size={24} />
                    <span className="hidden lg:block text-2xl text-gray-200 font-bebas">
                      Connect
                    </span>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="walletbackground flex items-center gap-2 p-2 rounded-lg h-10"
                    onClick={openChainModal}
                  >
                    <FaWallet size={24} />
                    <span className="hidden lg:block text-2xl text-gray-200 font-bebas">
                      Wrong Network
                    </span>
                  </button>
                );
              }
              return (
                <div className="flex items-center gap-3">
                  <button
                    className="hidden sm:flex walletbackground items-center gap-2 p-2 rounded-lg h-10"
                    onClick={openChainModal}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-2xl text-gray-200 font-bebas">
                      {chain.name}
                    </span>
                  </button>

                  <button
                    className="walletbackground flex items-center gap-2 p-2 rounded-lg h-10"
                    onClick={() => setIsOpen(true)}
                  >
                    <FaWallet size={24} />
                    <span className="hidden lg:block text-2xl text-gray-200 font-bebas">
                      {account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}

            {isOpen && (
              <WalletModal
                isOpen={isOpen}
                closeModal={() => setIsOpen(false)}
                balanceInETH={account?.displayBalance ?? '0'}
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
