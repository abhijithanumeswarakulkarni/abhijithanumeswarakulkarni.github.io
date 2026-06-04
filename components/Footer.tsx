import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6">
      <div className="gdiv mb-8" />
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border border-g-gold/35 rotate-45 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-g-gold/55" />
          </div>
          <span className="font-cinzel text-xs text-g-muted tracking-widest">ABHIJIT.HK</span>
        </div>
        <span className="font-mono text-xs text-g-muted/45">
          © {new Date().getFullYear()} — BUILT WITH REACT &amp; TYPESCRIPT
        </span>
        <span className="font-mono text-xs text-g-gold/25">v2.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
