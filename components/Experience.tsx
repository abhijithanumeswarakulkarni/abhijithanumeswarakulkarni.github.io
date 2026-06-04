import React from 'react';
import { useInView } from './hooks/useInView';

const quests = [
  {
    role:       'Software Engineer Intern',
    company:    'SnapRefund Inc.',
    duration:   'Jun 2025 – Present',
    location:   'Los Angeles, CA',
    rarity:     'legendary',
    label:      'LEGENDARY',
    logoUrl:    'https://img.logo.dev/snaprefund.io?token=pk_XFuxQT5RQj6fYiG8k5sbBQ',
    points: [
      'Crafted a role-based IAM system with PostgreSQL, NestJS, Vue.js, and Nuxt — cutting user onboarding time by 80%.',
      'Managed environment variables and email templates with AWS Session Manager and AWS Console.',
    ],
  },
  {
    role:       'Senior Software Engineer',
    company:    'Accolite Digital · Morgan Stanley',
    duration:   'Jul 2021 – Jun 2024',
    location:   'Bangalore, India',
    rarity:     'epic',
    label:      'EPIC',
    logoUrl:    'https://img.logo.dev/morganstanley.com?token=pk_XFuxQT5RQj6fYiG8k5sbBQ',
    points: [
      'Designed a real-time revenue dashboard in Spring Boot, React, and Highcharts — contributing to a 70% revenue increase.',
      'Built a shared StencilJS + Tailwind component library used across 5+ internal apps, speeding delivery by 90%.',
      'Adopted LaunchDarkly for feature flagging, minimising deployment risk by 75%.',
      'Implemented a Notification Center with Kafka and Redis, boosting user satisfaction by 80%.',
      'Led performance profiling (DevTools, Grafana, Prometheus), reducing UI/API latency by 45%.',
    ],
  },
  {
    role:       'Software Engineer',
    company:    'Accolite Digital · Morgan Stanley',
    duration:   'Jul 2020 – Jun 2021',
    location:   'Bangalore, India',
    rarity:     'rare',
    label:      'RARE',
    logoUrl:    'https://img.logo.dev/morganstanley.com?token=pk_XFuxQT5RQj6fYiG8k5sbBQ',
    points: [
      'Championed micro-service and micro-frontend adoption via Spring Boot, React, and Webpack Module Federation.',
      'Rolled out a lightweight feature toggle mechanism in MongoDB and Java.',
    ],
  },
  {
    role:       'Software Engineer Intern',
    company:    'Accolite Digital · Juspay Technologies',
    duration:   'Jan 2020 – Jun 2020',
    location:   'Bangalore, India',
    rarity:     'uncommon',
    label:      'UNCOMMON',
    logoUrl:    'https://img.logo.dev/juspay.io?token=pk_XFuxQT5RQj6fYiG8k5sbBQ',
    points: [
      'Handled Single Sign-On for a payments dashboard — wiring up OIDC with JWT auth in VanillaJS and Node.js.',
    ],
  },
];

const Experience: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-4xl mx-auto">
        <p className="slabel mb-2">// Achievements</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-4">Quest Log</h2>

        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-xs bg-g-green/10 text-g-green border border-g-green/30 px-3 py-1">
            ✓ COMPLETED
          </span>
          <span className="font-mono text-xs text-g-muted">{quests.length} quests completed</span>
        </div>

        <div className="relative space-y-6">
          {/* Timeline spine */}
          <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-g-gold/35 via-g-gold/15 to-transparent" />

          {quests.map((q, i) => (
            <div key={i} className="relative pl-16 group">
              {/* Logo node */}
              <div className="absolute left-0 top-0 w-10 h-10 bg-g-panel border border-g-border group-hover:border-g-gold/40 overflow-hidden flex items-center justify-center transition-all duration-300">
                <img
                  src={q.logoUrl}
                  alt={q.company}
                  className="w-8 h-8 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Quest card */}
              <div className="gf p-5 group-hover:border-g-gold/30 transition-all duration-300">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-cinzel text-sm font-bold text-g-text">{q.role}</h3>
                    <p className="font-mono text-g-gold text-xs mt-1">{q.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`font-mono text-xs border px-2 py-0.5 rar-${q.rarity}`}>{q.label}</span>
                    <span className="font-mono text-xs text-g-muted">{q.duration}</span>
                    <span className="font-mono text-xs text-g-muted/50">{q.location}</span>
                  </div>
                </div>

                <div className="gdiv mb-4" />

                {/* Objectives */}
                <p className="slabel mb-3">Objectives Completed</p>
                <div className="space-y-2.5">
                  {q.points.map((pt, j) => (
                    <div key={j} className="flex gap-3 text-g-muted font-raj text-sm leading-relaxed">
                      <span className="text-g-gold font-mono flex-shrink-0 text-xs mt-0.5">◆</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
