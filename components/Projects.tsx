import React from 'react';
import ProjectCard from './ProjectCard';
import { useInView } from './hooks/useInView';
import type { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: 'AI Debug Assistant',
    description:
      'AI debugging assistant that parses error logs into plain-English explanations, code fixes, and curated resources via Groq-hosted LLMs.',
    tags: ['Python', 'Svelte', 'FastAPI', 'LLM'],
    categories: ['AI/ML', 'Web App'],
    imageUrl: 'https://picsum.photos/seed/project1/800/600',
    liveUrl: 'https://ai-debug-assistant-ui.vercel.app/',
    githubUrl: 'https://github.com/abhijithanumeswarakulkarni/ai-debug-assistant-ui',
    rarity: 'legendary',
    rarityLabel: 'LEGENDARY',
  },
  {
    id: 2,
    title: 'Forensic Sketch Generator',
    description:
      'Stable Diffusion + LoRA trained on 1.5M FaceCaption pairs to generate forensic sketches from text, with Llama3 prompt enhancement.',
    tags: ['Stable Diffusion', 'LoRA', 'Llama3', 'PyTorch'],
    categories: ['AI/ML'],
    imageUrl: 'https://picsum.photos/seed/project2/800/600',
    githubUrl:
      'https://github.com/abhijithanumeswarakulkarni/Multimodal-Deep-Learning-for-Generating-Forensic-Facial-Sketches',
    rarity: 'epic',
    rarityLabel: 'EPIC',
  },
  {
    id: 3,
    title: 'Interactive Portfolio',
    description:
      'This drive-around portfolio — an isometric canvas game in React + TypeScript, deployed on GitHub Pages.',
    tags: ['React', 'TypeScript', 'Canvas', 'GitHub Pages'],
    categories: ['Web App'],
    imageUrl: 'https://picsum.photos/seed/project3/800/600',
    githubUrl: 'https://github.com/abhijithanumeswarakulkarni/abhijithanumeswarakulkarni.github.io',
    rarity: 'rare',
    rarityLabel: 'RARE',
  },
];

const Projects: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-12 px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ background: 'linear-gradient(180deg, rgb(8,12,20) 0%, rgb(11,17,28) 50%, rgb(8,12,20) 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="slabel mb-2">// Inventory</p>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-g-text tracking-wide mb-8">Arsenal</h2>

        {/* Three aligned cards — equal height, no scrolling needed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-stretch">
          {projects.map((project, i) => (
            <div key={project.id} className="animate-slide-up h-full" style={{ animationDelay: `${i * 80}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://github.com/abhijithanumeswarakulkarni?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="gbtn"
          >
            <span>View Full Arsenal on GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
