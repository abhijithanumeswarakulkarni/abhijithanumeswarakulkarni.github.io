import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">About Me</h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-2/5">
          <img 
            src="https://picsum.photos/600/800" 
            alt="Abhijit Hanumeswara Kulkarni" 
            className="rounded-lg shadow-2xl shadow-accent/20 object-cover w-full aspect-[4/3] max-h-[500px]"
          />
        </div>
        <div className="md:w-3/5 text-base sm:text-lg text-text-secondary space-y-4">
          <p>
            Hello! I'm Abhijit, a dedicated Full Stack Engineer currently pursuing a Master's degree in Computer Science at the University of Southern California. My passion lies in building robust, scalable, and user-centric web applications.
          </p>
          <p>
            With professional experience at companies like Morgan Stanley and SnapRefund, I've honed my skills in both front-end and back-end development. I thrive on solving complex problems and have a proven track record of delivering high-impact solutions, from designing real-time dashboards to architecting micro-frontend systems.
          </p>
          <p>
            I am proficient with modern technologies including React, TypeScript, Java, Spring Boot, and various cloud services. I'm always eager to learn and apply new technologies to create efficient and elegant digital experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;