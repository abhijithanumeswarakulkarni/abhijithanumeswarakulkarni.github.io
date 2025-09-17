
import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: "AI Debug Assistant",
    description: "Developed an AI-powered debugging assistant that parses error logs and returns plain-English explanations, code fixes, and curated external resources backed by Groq-hosted LLMs.",
    tags: ["Python", "JavaScript", "Svelte", "FastAPI", "Vercel", "LLM"],
    categories: ["AI/ML", "Web App"],
    imageUrl: "https://picsum.photos/seed/project1/800/600",
    liveUrl: "https://ai-debug-assistant-ui.vercel.app/",
    githubUrl: "https://github.com/abhijithanumeswarakulkarni/ai-debug-assistant-ui",
  },
  {
    id: 2,
    title: "Multimodal Forensic Sketch Generator",
    description: "Trained a Stable Diffusion model with LoRA on 1.5M FaceCaption pairs to generate forensic sketches from text, enhancing prompts with Llama3 and achieving significant improvements over baseline.",
    tags: ["Python", "Stable Diffusion", "LoRA", "Llama3", "PyTorch"],
    categories: ["AI/ML"],
    imageUrl: "https://picsum.photos/seed/project2/800/600",
    githubUrl: "https://github.com/abhijithanumeswarakulkarni/Multimodal-Deep-Learning-for-Generating-Forensic-Facial-Sketches",
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "Created this interactive portfolio website in React and TypeScript using a component-based architecture, deployed via GitHub Pages for seamless updates and feature expansion.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "Github Pages"],
    categories: ["Web App"],
    imageUrl: "https://picsum.photos/seed/project3/800/600",
    githubUrl: "https://github.com/abhijithanumeswarakulkarni/abhijithanumeswarakulkarni.github.io",
  },
];

const filterCategories = ['All', 'AI/ML', 'Web App'];

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects;
    }
    return projects.filter(p => p.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section id="projects" className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Technical Projects</h2>
      
      {/* New Text-based Filter Control */}
      <div className="flex justify-center items-center gap-x-3 sm:gap-x-4 mb-12 text-sm sm:text-base text-text-secondary animate-fade-in" style={{ animationDelay: '300ms' }}>
        {filterCategories.map((category, index) => (
          <React.Fragment key={category}>
            <button
              onClick={() => setActiveFilter(category)}
              className={`
                font-medium transition-colors duration-300
                ${activeFilter === category ? 'text-accent' : 'hover:text-text-primary'}
              `}
            >
              {category}
            </button>
            {index < filterCategories.length - 1 && (
              <span className="select-none">/</span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Projects Grid - Key added to re-trigger animations on filter change */}
      <div key={activeFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id} // Use a stable key for better React performance
            className="animate-slide-in-up"
            style={{ animationDelay: `${50 + index * 100}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Explore More Button */}
      <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <a 
          href="https://github.com/abhijithanumeswarakulkarni?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/40"
        >
          <span>Explore More Projects</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

    </section>
  );
};

export default Projects;