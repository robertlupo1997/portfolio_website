import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
    { href: '/resume.pdf', label: 'Resume', external: true },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="#hero" className="header-logo">
        TREY.ML
      </a>

      <nav className="header-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="header-nav-link"
            {...(link.external && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
