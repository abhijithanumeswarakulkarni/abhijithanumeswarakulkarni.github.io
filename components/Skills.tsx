import React from 'react';
import { useInView } from './hooks/useInView';

const skillGroups = [
  {
    category: 'Languages & Frameworks',
    accent:   '#FFFFFF',
    skills:   ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Svelte', 'Java', 'Spring Boot', 'NestJS', 'Python'],
  },
  {
    category: 'Databases & Messaging',
    accent:   '#E2E8F0',
    skills:   ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Kafka', 'Redis'],
  },
  {
    category: 'Tools & Monitoring',
    accent:   '#C8D0DC',
    skills:   ['Grafana', 'Prometheus', 'Git', 'JIRA', 'GraphQL', 'Postman'],
  },
  {
    category: 'DevOps & Cloud',
    accent:   '#AAB4C4',
    skills:   ['Docker', 'Jenkins', 'AWS'],
  },
];

const Skills: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="skills"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto">
        <p className="slabel mb-2">// Loadout</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-16">Ability Tree</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillGroups.map(({ category, accent, skills }) => (
            <div key={category} className="gf p-6">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 flex-shrink-0" style={{ background: accent }} />
                <h3 className="font-cinzel text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>
                  {category}
                </h3>
              </div>

              {/* Skill gems */}
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div key={skill} className="skill-gem">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
