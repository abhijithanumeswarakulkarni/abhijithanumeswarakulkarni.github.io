import React, { useState, useEffect } from 'react';

const navItems = [
  { label: 'About',      href: '#about' },
  { label: 'Education',  href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Contact',    href: '#contact' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-g-bg/95 backdrop-blur-md border-b border-g-gold/15 shadow-lg shadow-black/40'
            : 'bg-transparent'
        }`}
      >
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-g-gold/40 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="w-7 h-7 border border-g-gold/50 rotate-45 flex items-center justify-center transition-all duration-200 group-hover:border-g-gold group-hover:shadow-[0_0_10px_rgba(232,162,20,0.3)]">
              <div className="w-2.5 h-2.5 bg-g-gold/60 group-hover:bg-g-gold transition-colors duration-200" />
            </div>
            <div className="leading-none">
              <span className="font-cinzel text-sm font-bold text-g-text group-hover:text-g-bright transition-colors duration-200 tracking-widest">
                ABHIJIT.HK
              </span>
              <span className="font-mono text-xs text-g-gold/60 ml-2">LVL 25</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(({ label, href }) => (
              <a key={href} href={href} onClick={(e) => go(e, href)} className="nav-link">
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="assets/files/resume.pdf" download className="hidden md:inline-flex gbtn text-xs py-2 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Resume</span>
            </a>

            {/* Hamburger */}
            <button
              className="lg:hidden p-1.5 flex flex-col gap-[5px]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-g-gold transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-0.5 bg-g-gold transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-g-gold transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-g-bg/97 flex flex-col items-center justify-center transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-g-gold/25" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-g-gold/25" />

        <p className="font-mono text-xs text-g-gold/40 tracking-[0.35em] mb-8 uppercase">Navigation</p>

        <div className="w-full max-w-xs px-8">
          {navItems.map(({ label, href }) => (
            <a key={href} href={href} onClick={(e) => go(e, href)} className="m-nav">
              {label}
            </a>
          ))}
        </div>

        <a href="assets/files/resume.pdf" download className="gbtn mt-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download Resume</span>
        </a>
      </div>
    </>
  );
};

export default Header;
