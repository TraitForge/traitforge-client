import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './styles.module.scss';

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
    <>
      <button
        className={styles.navToggle}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        {isNavExpanded ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={`${styles.nav} ${isNavExpanded ? styles.expanded : ''}`}>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className={`${isActive(link.url) ? styles.active : ''}`}
            onClick={handleNavLinkClick}
          >
            {link.text}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
