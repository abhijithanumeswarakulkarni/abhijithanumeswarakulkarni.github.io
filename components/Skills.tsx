import React from 'react';
import SkillBadge from './SkillBadge';
import type { SkillInfo } from './SkillInfo';

const skillData: { [category: string]: SkillInfo[] } = {
  "Languages & Frameworks": [
    { name: "JavaScript", icon: { source: "devicon", slug: "javascript", variant: "plain" } },
    { name: "TypeScript", icon: { source: "devicon", slug: "typescript", variant: "plain" } },
    { name: "React", icon: { source: "devicon", slug: "react", variant: "original" } },
    { name: "Vue.js", icon: { source: "devicon", slug: "vuejs", variant: "plain" } },
    { name: "Svelte", icon: { source: "devicon", slug: "svelte", variant: "plain" } },
    { name: "Java", icon: { source: "devicon", slug: "java", variant: "plain" } },
    { name: "Spring Boot", icon: { source: 'external', url: 'https://cdn.simpleicons.org/springboot' } },
    { name: "NestJS", icon: { source: 'external', url: 'https://cdn.simpleicons.org/nestjs' } },
    { name: "Python", icon: { source: "devicon", slug: "python", variant: "plain" } },
  ],
  "Databases & Messaging": [
    { name: "PostgreSQL", icon: { source: "devicon", slug: "postgresql", variant: "plain" } },
    { name: "MySQL", icon: { source: 'external', url: 'https://cdn.simpleicons.org/mysql' } },
    { name: "MongoDB", icon: { source: "devicon", slug: "mongodb", variant: "plain" } },
    { name: "Firebase", icon: { source: "devicon", slug: "firebase", variant: "plain" } },
    { name: "Kafka", icon: { source: "devicon", slug: "apachekafka", variant: "original" } },
    { name: "Redis", icon: { source: "devicon", slug: "redis", variant: "plain" } },
  ],
  "Tools & Monitoring": [
    { name: "Grafana", icon: { source: "devicon", slug: "grafana", variant: "original" } },
    { name: "Prometheus", icon: { source: "devicon", slug: "prometheus", variant: "original" } },
    { name: "Git", icon: { source: "devicon", slug: "git", variant: "plain" } },
    { name: "JIRA", icon: { source: "devicon", slug: "jira", variant: "plain" } },
    { name: "GraphQL", icon: { source: "devicon", slug: "graphql", variant: "plain" } },
    { name: "Postman", icon: { source: "devicon", slug: "postman", variant: "plain" } },
  ],
  "DevOps & Cloud": [
    { name: "Docker", icon: { source: "devicon", slug: "docker", variant: "plain" } },
    { name: "Jenkins", icon: { source: "devicon", slug: "jenkins", variant: "plain" } },
    { name: "AWS", icon: { source: "devicon", slug: "amazonwebservices", variant: "original-wordmark" } },
  ],
};


const Skills: React.FC = () => {
  return (
    <section id="skills" className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Skills</h2>
      <div className="max-w-5xl mx-auto space-y-8">
        {Object.entries(skillData).map(([category, skills]) => (
          <div key={category} className="animate-fade-in" style={{ animationDelay: '400ms'}}>
            <h3 className="text-lg sm:text-xl font-bold text-accent mb-4 text-center">{category}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <div key={skill.name} className="animate-fade-in" style={{ animationDelay: `${500 + index * 30}ms`}}>
                  <SkillBadge skill={skill.name} icon={skill.icon} large />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;