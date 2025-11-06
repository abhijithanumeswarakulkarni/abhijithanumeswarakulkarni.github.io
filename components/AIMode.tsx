import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ThinkingAnimation from './ThinkingAnimation';
import Robot from './Robot';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const portfolioContext = `
# Abhijit Hanumeswara Kulkarni
- Contact: hanumesw@usc.edu | abhijithanumeswarakulkarni.github.io | Los Angeles, CA
- Summary: A dedicated Full Stack Engineer and Master's student in Computer Science at the University of Southern California. Passionate about building robust, scalable, and user-centric web applications with experience at companies like Morgan Stanley and SnapRefund.

# Education
- University of Southern California, Los Angeles, CA
- Master of Science in Computer Science
- Expected Graduation: May 2026
- Relevant Courses: Analysis of Algorithms, Multimedia Systems Design

# Skills
- Languages & Frameworks: JavaScript/TypeScript (ES6), React, Vue.js, Svelte, Java, Spring Boot, NestJS, Python
- Databases & Messaging: PostgreSQL, MySQL, MongoDB, Firebase, Kafka, Redis
- Tools & Monitoring: Grafana, Prometheus, Git, JIRA, LaunchDarkly, REST, GraphQL, Postman
- DevOps & Cloud: Docker, Jenkins, AWS

# Work Experience

## SnapRefund Inc. - Software Engineer Intern (Jun 2025 - Present)
- Crafted a role-based IAM system with PostgreSQL, NestJS, Vue.js, and Nuxt, cutting user onboarding time by 80%.
- Managed environment variables and email templates with AWS Session Manager and AWS Console.

## Accolite Digital | Morgan Stanley - Senior Software Engineer (Jul 2021 - Jun 2024)
- Designed a real-time revenue dashboard (Spring Boot, React, Highcharts), increasing revenue by 70%.
- Built a shared library of StencilJS + Tailwind components, speeding up feature delivery time by 90%.
- Adopted LaunchDarkly for feature flagging, minimizing deployment risk by 75%.
- Implemented a Notification Center with Kafka and Redis, boosting user satisfaction by 80%.
- Achieved >80% test coverage (JUnit, Jenkins), decreasing production defects by 50%.
- Led performance profiling (DevTools, Grafana, Prometheus), reducing UI/API latency by 45%.
- Delivered a gamified onboarding tool with React, accelerating new hire ramp-up by 60%.

## Accolite Digital | Morgan Stanley - Software Engineer (Jul 2020 - Jun 2021)
- Championed micro-service/micro-frontend adoption (Spring Boot, React, Webpack Module Federation).
- Rolled out a feature toggle mechanism in MongoDB and Java.

## Accolite Digital | Juspay Technologies - Software Engineer Intern (Jan 2020 - Jun 2020)
- Handled Single Sign-On for a payments dashboard (OpenID Connect, JWT, VanillaJS, Node.js).

# Technical Projects

## AI Debug Assistant
- Description: AI-powered assistant that parses error logs and returns plain-English explanations, code fixes, and resources.
- Tech: Python, JavaScript, Svelte, FastAPI, Vercel, LLMs.

## Multimodal Forensic Sketch Generator
- Description: Trained a Stable Diffusion model with LoRA to generate forensic sketches from text.
- Tech: Python, Stable Diffusion, LoRA, Llama3, PyTorch.

## Personal Portfolio
- Description: This interactive portfolio website.
- Tech: React, TypeScript, Tailwind CSS, Gemini API, Github Pages.
`;

const systemInstruction = `You are a helpful and friendly AI assistant for Abhijit Hanumeswara Kulkarni's portfolio. Your goal is to answer questions about Abhijit based ONLY on the context provided. Be conversational and professional. If a question is outside the scope of the provided context, politely state that you can only answer questions about Abhijit's professional experience, skills, and projects. Do not invent information. Keep answers concise. The context is: ${portfolioContext}`;

// FIX: Initialize the GoogleGenAI client once at the module level to avoid creating a new instance on every request.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const ai = new GoogleGenAI({ apiKey: "AIzaSyBQtndQih3xePNooUsV57CVVF4aCHL_1Wc" });

const AIMode: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm Abhijit's AI assistant. Feel free to ask me anything about his skills, experience, or projects." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRobotAwake, setIsRobotAwake] = useState(false);
  const [isRobotDrowsy, setIsRobotDrowsy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const drowsyTimerRef = useRef<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);
  
  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Wake the robot up, reset timers and states
    setIsRobotAwake(true);
    setIsRobotDrowsy(false);
    if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);

    // Set new timers
    drowsyTimerRef.current = window.setTimeout(() => {
      setIsRobotDrowsy(true);
    }, 27000); // Drowsy after 27 seconds

    sleepTimerRef.current = window.setTimeout(() => {
      setIsRobotAwake(false);
      setIsRobotDrowsy(false); // Reset drowsy when it falls asleep
    }, 30000); // Sleep after 30 seconds

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentInput,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-primary">

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 overflow-hidden">
        {/* Chat Section (Left) */}
        <div className="w-full h-full flex flex-col bg-secondary rounded-lg shadow-2xl shadow-black/50 overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-accent/20 text-center">
            <h1 className="text-xl font-bold text-text-primary">AI Mode</h1>
            <p className="text-sm text-text-secondary">Ask about my experience, skills, or projects.</p>
          </div>
          <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-accent text-primary flex-shrink-0 flex items-center justify-center font-bold text-sm">AI</div>}
                <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-accent text-primary' : 'bg-primary text-text-primary'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && <ThinkingAnimation />}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-accent/20">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 'What was his role at Morgan Stanley?'"
                className="w-full p-3 pr-12 bg-primary border border-secondary rounded-lg focus:ring-2 focus:ring-accent focus:outline-none text-text-primary transition-all duration-300"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Robot Section (Right) */}
        <div className="hidden lg:flex items-center justify-center h-full">
            <Robot isThinking={isLoading} isAwake={isRobotAwake} isDrowsy={isRobotDrowsy} />
        </div>
      </main>
    </div>
  );
};

export default AIMode;