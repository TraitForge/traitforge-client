import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './styles.module.scss';
import { Logo, Wallter } from '@/icons';

const links = [
  { url: '/', text: 'HOME' },
  { url: '/forging', text: 'FORGING' },
  { url: '/trading', text: 'MARKETPLACE' },
  { url: '/honey-pot', text: 'HONEYPOT' },
  { url: '/stats', text: 'GAME STATS' },
];

const Navbar = ({ isNavExpanded, setIsNavExpanded }) => {
  const router = useRouter();

  const handleNavLinkClick = () => {
    setIsNavExpanded(false);
  };

  const isActive = path => {
    return router.pathname === path;
  };

  return (
    <header className={styles.nav}>
      {/* <button
        className={styles.navToggle}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        {isNavExpanded ? <FaTimes /> : <FaBars />}
      </button> */}
      <nav className={` container flex items-center justify-between ${isNavExpanded ? styles.expanded : ''}`}>
        <Link href="/" className='py-[13px] inline-block'>
          <Logo />
        </Link>
        <ul className='flex gap-x-[64px]'>
          {links.map((link, index) => (
            <li className='text-[32px] hover:border-b-[1px] border-b-[0px] border-solid border-white'>
              <Link
                key={index}
                href={link.url}
                // className={`${isActive(link.url) ? styles.active : ''}`}
                onClick={handleNavLinkClick}
                className='text-white hover:text-primary'
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        <Link className='flex items-center gap-x-8' href="/wallet">
          <Wallter />
          <span className='uppercase text-[32px]'>Wallet</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
