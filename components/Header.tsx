import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isAIMode: boolean;
  setIsAIMode: (value: boolean) => void;
  navigateTo: (index: number) => void;
  activeIndex: number;
  sections: { id: string, name: string }[];
}

const Header: React.FC<HeaderProps> = ({ isAIMode, setIsAIMode, navigateTo, activeIndex, sections }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsScrolled(isAIMode || activeIndex > 0);
  }, [isAIMode, activeIndex]);

  useEffect(() => {
    if (isMenuOpen && !isAIMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isAIMode]);

  useEffect(() => {
    // Close mobile menu if user switches to AI mode
    if (isAIMode) {
      setIsMenuOpen(false);
    }
  }, [isAIMode]);

  const navLinks = sections.slice(1).map((sec, i) => ({
    href: `#${sec.id}`,
    label: sec.name,
    index: i + 1,
  }));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    navigateTo(index);
    setIsMenuOpen(false); // Close menu on navigation
  };
  
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isAIMode) {
      navigateTo(0);
    }
  }

  const SwitchModeButton = (
    <button
      onClick={() => setIsAIMode(!isAIMode)}
      className="bg-accent text-primary font-medium py-2 px-5 rounded-full text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
      aria-label={isAIMode ? 'Switch to Classic Mode' : 'Switch to AI Mode'}
    >
      {isAIMode ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span>Classic</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>AI Mode</span>
        </>
      )}
    </button>
  );

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-primary/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
          {/* Left Side: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger Button (only in manual mode on mobile) */}
            {!isAIMode && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden z-50 p-2 -ml-2 text-text-primary focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                  <span className={`block h-0.5 w-full bg-current rounded-full transform transition duration-300 ease-in-out ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
                  <span className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-full bg-current rounded-full transform transition duration-300 ease-in-out ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
                </div>
              </button>
            )}

            <a 
              href="#" 
              onClick={handleLogoClick}
              className={`text-2xl font-bold text-text-primary hover:text-accent transition-colors ${isAIMode ? 'cursor-default' : 'cursor-pointer'}`}
            >
              AK.
            </a>
          </div>

          {/* Right Side: Nav + Toggles */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className={`hidden md:flex items-center transition-all duration-500 ${isAIMode ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
              <div className="flex space-x-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.index)}
                    className={`transition-colors duration-300 font-medium cursor-pointer ${
                      activeIndex === link.index ? 'text-accent' : 'text-text-secondary hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 md:ml-4">
              <ThemeToggle />
              {SwitchModeButton}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 bg-primary/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen && !isAIMode ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.index)}
              className={`text-3xl font-bold transition-colors duration-300 ${
                activeIndex === link.index ? 'text-accent' : 'text-text-primary hover:text-accent'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
