import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mailtoLink = `mailto:hanumesw@usc.edu?subject=${encodeURIComponent(
    formData.subject
  )}&body=${encodeURIComponent(
    `From: ${formData.email}\n\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="text-center animate-slide-in-up" style={{ animationDelay: '400ms' }}>
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
      <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-8">
        I'm currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, feel free to reach out. I'll get back to you as soon as possible!
      </p>
      
      <form className="max-w-xl mx-auto space-y-4 text-left">
        <div>
          <label htmlFor="email" className="sr-only">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 bg-secondary border border-accent/30 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none text-text-primary transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="subject" className="sr-only">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full p-3 bg-secondary border border-accent/30 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none text-text-primary transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="w-full p-3 bg-secondary border border-accent/30 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none text-text-primary transition-all duration-300"
          ></textarea>
        </div>
        <div className="text-center">
            <a 
                href={mailtoLink}
                className="inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
            >
                Send Message
            </a>
        </div>
      </form>
    </section>
  );
};

export default Contact;
