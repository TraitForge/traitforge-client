import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Logo } from '@/icons';
import ConnectButton from '@/components/ui/WalletButton';

const links = [
  { url: '/', text: 'HOME' },
  { url: '/forging', text: 'FORGING' },
  { url: '/trading', text: 'MARKETPLACE' },
  { url: '/honey-pot', text: 'HONEYPOT' },
  { url: '/stats', text: 'GAME STATS' },
];

const Navbar = ({ isNavExpanded, setIsNavExpanded }) => {
  const router = useRouter();

  const commonClasses = `text-base flex items-center py-6 lg:text-[32px] lg:text-[32px] relative after:absolute after:bottom-0 after:left-0 after:w-full hover:after:h-[2px] after:h-[0px]`;
  const navLinkClasses = classNames(commonClasses, {
    'after:bg-neon-orange hover:text-neon-orange': router.asPath === '/forging',
    'after:bg-neon-green hover:text-neon-green': router.asPath === '/trading',
    'after:bg-neon-purple hover:text-neon-purple':
      router.asPath === '/honey-pot',
    'after:bg-neon-green-yellow hover:text-neon-green-yellow':
      router.asPath === '/stats',
    'after:bg-primary hover:text-primary': router.asPath === '/',
  });

  const activeClass = classNames({
    'text-neon-orange': router.asPath === '/forging',
    'text-neon-green': router.asPath === '/trading',
    'text-neon-purple': router.asPath === '/honey-pot',
    'text-neon-green-yellow': router.asPath === '/stats',
    'text-primary': router.asPath === '/',
  });

  return (
    <header className={styles.nav}>
      {/* <button
        className={styles.navToggle}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        {isNavExpanded ? <FaTimes /> : <FaBars />}
      </button> */}
      <nav
        className={`container flex items-center justify-between ${
          isNavExpanded ? styles.expanded : ''
        }`}
      >
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <ul className="flex gap-x-[20px] xl:gap-x-[64px] max-md:hidden">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                className={`${navLinkClasses} ${link.url === router.asPath && activeClass}`}
                href={link.url}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <ConnectButton />
      </nav>
    </header>
  );
};

export default Navbar;
