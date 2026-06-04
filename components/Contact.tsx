import React from 'react';
import { useInView } from './hooks/useInView';

const channels = [
  { label: 'EMAIL',    value: 'hanumesw@usc.edu',          href: 'mailto:hanumesw@usc.edu',                            external: false },
  { label: 'PHONE',    value: '+1 (213) 275-7030',          href: 'tel:+12132757030',                                   external: false },
  { label: 'LINKEDIN', value: '/in/abhijit-h-kulkarni',     href: 'https://www.linkedin.com/in/abhijit-h-kulkarni/',    external: true  },
  { label: 'GITHUB',   value: 'abhijithanumeswarakulkarni', href: 'https://github.com/abhijithanumeswarakulkarni',       external: true  },
];

const Contact: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ background: 'linear-gradient(180deg, rgb(8,12,20) 0%, rgb(11,17,28) 50%, rgb(8,12,20) 100%)' }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="slabel mb-2">// Comms</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-4">Guild Hall</h2>
        <p className="text-g-muted font-raj text-lg mb-12 max-w-lg">
          Open to new quests and collaborations. Send a transmission and I'll respond swiftly.
        </p>

        <div className="gf4 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-g-gold/15 bg-g-panel2/30">
            <span className="slabel">Transmission Channels</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-g-red/50" />
              <div className="w-2 h-2 rounded-full bg-g-gold/50" />
              <div className="w-2 h-2 rounded-full bg-g-green/50" />
            </div>
          </div>

          {/* Channels */}
          <div className="divide-y divide-g-border/30">
            {channels.map(({ label, value, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-5 px-5 py-4 group hover:bg-g-gold/5 transition-colors duration-200"
              >
                <span className="font-mono text-xs text-g-gold/60 tracking-widest w-20 flex-shrink-0">{label}</span>
                <span className="font-mono text-xs text-g-border/70">——</span>
                <span className="font-raj text-g-muted group-hover:text-g-text transition-colors duration-200 flex-1 min-w-0 truncate">
                  {value}
                </span>
                {external && (
                  <span className="font-mono text-xs text-g-muted/35 group-hover:text-g-gold/50 transition-colors flex-shrink-0">
                    ↗
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
