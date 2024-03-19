import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

const SocialMediaLink = ({ url, icon }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="SM-icons">
        <FontAwesomeIcon icon={icon} size="1.5x" />
    </a>
);

const Footer = ({ showInstructions, toggleInstructions }) => {
    const links = [
        { url: 'https://t.me/+b31jKqlV-1BjNzY1', icon: faTelegram, text: 'Telegram' },
        { url: 'https://twitter.com/TraitForge', icon: faTwitter, text: 'Twitter' },
        { url: 'https://discord.gg/Q3Z9A9eV', icon: faDiscord, text: 'Discord' },
    ];

    return (
        <footer className="footer-container">
            <div className="App-Footer">
                {links.map((link, index) => (
                    <SocialMediaLink key={index} url={link.url} icon={link.icon} />
                ))}
            </div>
            <button onClick={toggleInstructions} className='instructions-button'>
                {showInstructions ? 'x' : '?'}
            </button>
        </footer>
    );
};

export default Footer;
