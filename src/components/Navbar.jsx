import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ isNavExpanded, setIsNavExpanded }) => {
    const router = useRouter();

    const handleNavLinkClick = () => {
        setIsNavExpanded(false);
    };

    const isActive = (path) => {
        return router.pathname === path;
    };

    return (
        <>
            <button className='nav-toggle' onClick={() => setIsNavExpanded(!isNavExpanded)}>
                {isNavExpanded ? <FaTimes /> : <FaBars />}
            </button>
            <nav className={isNavExpanded ? "navlist expanded" : "navlist"}>
                <Link href="/Home">
                    <a className={`nav-link ${isActive('/Home') ? 'active' : ''}`} onClick={handleNavLinkClick}>HOME</a>
                </Link>
                <Link href="/Forging">
                    <a className={`nav-link ${isActive('/Forging') ? 'active' : ''}`} onClick={handleNavLinkClick}>Forging</a>
                </Link>
                <Link href="/Trading">
                    <a className={`nav-link ${isActive('/Trading') ? 'active' : ''}`} onClick={handleNavLinkClick}>MARKETPLACE</a>
                </Link>
                <Link href="/HoneyPot">
                    <a className={`nav-link ${isActive('/HoneyPot') ? 'active' : ''}`} onClick={handleNavLinkClick}>HONEYPOT</a>
                </Link>
                <Link href="/Stats">
                    <a className={`nav-link ${isActive('/Stats') ? 'active' : ''}`} onClick={handleNavLinkClick}>GAME STATS</a>
                </Link>
            </nav>
        </>
    );
};

export default Navbar;

