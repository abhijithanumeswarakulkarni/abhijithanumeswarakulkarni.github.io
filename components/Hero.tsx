import React from 'react';
import InteractiveBackground from './InteractiveBackground';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative h-full flex items-center justify-center text-center animate-slide-in-up -m-4 md:-m-6">
      <InteractiveBackground />
      <div className="relative z-10 max-w-4xl px-4 md:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
          Abhijit Hanumeswara Kulkarni
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-6 text-accent">
          Master's Student & Full Stack Engineer
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
          I build robust, scalable, and user-centric web applications, leveraging my experience in both front-end and back-end development to create efficient and elegant digital experiences.
        </p>
        <a 
          href="../assets/files/resume.pdf"
          download="Abhijit_Hanumeswara_Kulkarni_Resume"
          className="group inline-flex items-center justify-center gap-3 bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent/40"
        >
          <span>Download Resume</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;