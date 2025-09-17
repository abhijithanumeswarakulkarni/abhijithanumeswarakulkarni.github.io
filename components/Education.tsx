import React from 'react';

const Education: React.FC = () => {
  return (
    <section id="education" className="animate-slide-in-up" style={{ animationDelay: '150ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Education</h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-2/5">
          <img 
            src="https://picsum.photos/seed/usc/800/600"
            alt="University of Southern California campus" 
            className="rounded-lg shadow-2xl shadow-accent/20 object-cover w-full aspect-[4/3] max-h-[500px]"
          />
        </div>
        <div className="md:w-3/5 text-base sm:text-lg text-text-secondary space-y-4">
          <p>
            I am currently pursuing a <strong className="text-text-primary">Master of Science in Computer Science</strong> at the prestigious <strong className="text-text-primary">University of Southern California (USC)</strong> in Los Angeles. I am on track to graduate in May 2026.
          </p>
          <p>
            At USC, I am deepening my expertise in core computer science principles and exploring advanced topics to stay at the forefront of technology. My coursework is designed to build a strong theoretical and practical foundation for my career.
          </p>
          <p>
            Key areas of my study include <strong className="text-text-primary">Analysis of Algorithms</strong>, where I've been dissecting complex computational problems, and <strong className="text-text-primary">Multimedia Systems Design</strong>, which has given me insights into the architecture of modern media applications. I am excited to apply this advanced knowledge to solve real-world challenges.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Education;