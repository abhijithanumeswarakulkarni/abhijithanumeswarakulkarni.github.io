
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 md:py-6 border-t border-secondary">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center text-text-secondary px-4 md:px-6 gap-2 sm:gap-4 text-center sm:text-left">
        <p className="text-sm flex items-center gap-1">
          Crafted with
          <svg
            role="img"
            aria-label="love"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-accent"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          using Google AI Studio
        </p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Abhijit Hanumeswara Kulkarni. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;