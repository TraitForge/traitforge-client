'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { motion, MotionProps } from 'framer-motion';
import { useAccount, useSignMessage } from 'wagmi';

import WalletButton from '../WalletButton';
import { Logo } from '~/components/icons';

const links = [
  { url: '/', text: 'HOME' },
  { url: '/forging', text: 'FORGING' },
  { url: '/trading', text: 'MARKETPLACE' },
  { url: '/nuke-fund', text: 'NUKEFUND' },
  //{ url: '/stats', text: 'GAME STATS' },
];

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useAccount();
  const [originalMessage, setOriginalMessage] = useState('');

  const { data: signMessageData, signMessage } = useSignMessage();

  useEffect(() => {
    // check user already registered
    (async () => {
      if (address) {
        try {
          const response = await fetch(`/api/user?walletAddress=${address}`);
          const data = await response.json();
          if (data.error === 'User does not exist') {
            const timestamp = Date.now();
            signMessage({ message: `${timestamp}` });
            setOriginalMessage(`${timestamp}`);
          }
        } catch (err) {
          console.error('Failed to check user registration:', err);
        }
      }
    })();
  }, [address]);

  useEffect(() => {
    (async () => {
      if (signMessageData && originalMessage) {
        try {
          const response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({
              messageData: signMessageData,
              originalMessage: originalMessage,
              walletAddress: address,
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to register user');
          }
        } catch (err) {
          console.error('Failed to register user:', err);
        }
      }
    })();
  }, [signMessageData, originalMessage, address]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

  const commonClasses = `text-base font-bebas flex items-center py-6 lg:text-[32px] lg:text-[32px] relative after:absolute after:bottom-0 after:left-0 after:w-full hover:after:h-[2px] after:h-[0px]`;
  const navLinkClasses = classNames(commonClasses, {
    'after:bg-neon-orange hover:text-neon-orange': router.asPath === '/forging',
    'after:bg-neon-green hover:text-neon-green': router.asPath === '/trading',
    'after:bg-neon-purple hover:text-neon-purple':
      router.asPath === '/nuke-fund',
    'after:bg-neon-green-yellow hover:text-neon-green-yellow':
      router.asPath === '/stats',
    'after:bg-primary hover:text-primary': router.asPath === '/',
  });

  const activeClass = classNames('', {
    'text-neon-orange': router.asPath === '/forging',
    'text-neon-green': router.asPath === '/trading',
    'text-neon-purple': router.asPath === '/nuke-fund',
    'text-neon-green-yellow': router.asPath === '/stats',
    'text-primary': router.asPath === '/',
  });

  const expandedClasses = classNames(
    'container max-lg:py-1 flex items-center justify-between'
  );

  return (
    <header className="z-50">
      <nav className={expandedClasses}>
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <ul className="flex gap-x-[20px] xl:gap-x-[64px] max-lg:hidden">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                className={`${navLinkClasses} ${
                  link.url === router.asPath ? activeClass : ''
                }`}
                href={link.url}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-center gap-x-6">
          <WalletButton />
          <button
            className={'focus:outline-none block lg:hidden'}
            onClick={() => setIsMenuOpen(prevState => !prevState)}
          >
            <motion.svg
              animate={isMenuOpen ? 'open' : 'closed'}
              className={'fill-current stroke-current'}
              height="1rem"
              viewBox="0 0 24 24"
              width="1rem"
            >
              <Line
                height={2}
                y1="10"
                x2="24"
                y2="20"
                variants={{
                  closed: { y1: 6, y2: 6 },
                  open: { y1: 0, y2: 20 },
                }}
              />
              <Line
                y1="20"
                x2="24"
                y2="20"
                variants={{
                  closed: { y1: 16, y2: 16 },
                  open: { y1: 20, y2: 0 },
                }}
              />
            </motion.svg>
          </button>
        </div>
        {isMenuOpen && (
          <ul className="absolute top-[56px] right-0 w-[70%] bg-black h-[calc(100vh-56px)] z-50 px-[46px] py-10">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  className={`${navLinkClasses} !text-[32px] ${
                    link.url === router.asPath && activeClass
                  }`}
                  href={link.url}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

const Line = (
  props: Omit<JSX.IntrinsicElements['line'] & MotionProps, 'ref'>
) => (
  <motion.line
    fill="#fff"
    stroke="#fff"
    strokeLinecap="round"
    strokeWidth="1.5"
    {...props}
  />
);
