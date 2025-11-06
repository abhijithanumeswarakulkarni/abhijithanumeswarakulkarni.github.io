import React from 'react';

const contactDetails = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'hanumesw@usc.edu',
    href: 'mailto:hanumesw@usc.edu',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone',
    value: '+1 (213) 275-7030',
    href: 'tel:+12132757030',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'Connect with me',
    href: 'https://www.linkedin.com/in/abhijit-h-kulkarni/',
  },
];

const Contact: React.FC = () => {
  return (
    <section id="contact" className="text-center animate-slide-in-up" style={{ animationDelay: '400ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
      <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-12">
        I'm currently open to new opportunities and collaborations. Feel free to reach out via email, phone, or connect with me on LinkedIn. I'll get back to you as soon as possible!
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16">
        {contactDetails.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label === 'LinkedIn' ? '_blank' : undefined}
            rel={item.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
            className="group flex flex-col items-center gap-4 text-text-primary hover:text-accent transition-colors duration-300"
          >
            <div className="bg-secondary p-5 rounded-full transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/30 border border-transparent group-hover:border-accent/50">
              {item.icon}
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{item.label}</p>
              <p className="text-text-secondary group-hover:text-accent transition-colors duration-300">{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
