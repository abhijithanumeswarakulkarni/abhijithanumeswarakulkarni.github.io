import React, { useState, useEffect, useRef, useCallback } from 'react';
import ManualMode from './components/ManualMode';
import AIMode from './components/AIMode';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Section components for Manual Mode
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';

const sections = [
  { id: 'hero', Comp: Hero, name: 'Home' },
  { id: 'about', Comp: About, name: 'About' },
  { id: 'education', Comp: Education, name: 'Education' },
  { id: 'experience', Comp: Experience, name: 'Experience' },
  { id: 'projects', Comp: Projects, name: 'Projects' },
  { id: 'skills', Comp: Skills, name: 'Skills' },
  { id: 'contact', Comp: Contact, name: 'Contact' },
];

const App: React.FC = () => {
  const [isAIMode, setIsAIMode] = useState(true);
  const [isSiteReady, setIsSiteReady] = useState(false);
  const [isLoaderUnmounted, setIsLoaderUnmounted] = useState(false);

  useEffect(() => {
    const prepareSite = () => {
      setIsSiteReady(true);
      sessionStorage.setItem('hasLoaded', 'true');
      setTimeout(() => {
        setIsLoaderUnmounted(true);
      }, 1000); // Duration of the loader's fade-out animation
    };

    if (sessionStorage.getItem('hasLoaded')) {
      // If already loaded in this session, show content almost immediately
      setTimeout(prepareSite, 100); 
    } else {
      // On first load of the session, show loader for a set duration
      const timer = setTimeout(prepareSite, 3000); // Show loader for 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  // State and logic lifted from ManualMode
  const [activeIndex, setActiveIndex] = useState(0);
  const lastNavigationTimeRef = useRef(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const navigateTo = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return;
    setActiveIndex(index);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    const now = Date.now();
    if (now - lastNavigationTimeRef.current > 1000) {
      lastNavigationTimeRef.current = now;
      navigateTo(index);
    }
  }, [navigateTo]);

  useEffect(() => {
    // This effect should only run for Manual Mode
    if (isAIMode) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      
      const now = Date.now();
      const navigationCooldown = 1000;

      if (now - lastNavigationTimeRef.current < navigationCooldown) {
        e.preventDefault();
        return;
      }

      const currentSectionEl = sectionRefs.current[activeIndex];
      if (!currentSectionEl) return;
      
      const { scrollTop, scrollHeight, clientHeight } = currentSectionEl;

      const isAtTop = scrollTop < 1;
      const isAtBottom = (scrollHeight - scrollTop - clientHeight) < 1;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const isContentScrollable = scrollHeight > clientHeight + 1;
      
      if (isContentScrollable) { 
        if (isScrollingDown && !isAtBottom) return;
        if (isScrollingUp && !isAtTop) return;
      }

      e.preventDefault();

      let targetIndex = activeIndex;
      if (isScrollingDown) targetIndex++;
      else if (isScrollingUp) targetIndex--;
      
      if (targetIndex !== activeIndex && targetIndex >= 0 && targetIndex < sections.length) {
          lastNavigationTimeRef.current = now;
          navigateTo(targetIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isAIMode, activeIndex, navigateTo]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-primary font-sans">
      {!isLoaderUnmounted && (
        <div className={`transition-opacity duration-1000 ease-in-out ${isSiteReady ? 'opacity-0' : 'opacity-100'}`}>
          <Loader />
        </div>
      )}
      
      <div className={`min-h-screen w-full flex flex-col transition-opacity duration-700 ${isSiteReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Header 
          isAIMode={isAIMode}
          setIsAIMode={setIsAIMode}
          navigateTo={handleNavigate}
          activeIndex={activeIndex}
          sections={sections}
        />
        {/* Add padding-top to account for fixed header height */}
        <div className="pt-[80px] md:pt-[96px] flex-1 flex flex-col">
          <main className="flex-1 relative overflow-x-hidden">
            {/* Manual Mode View */}
            <div
              className={`transition-opacity duration-500 ease-in-out absolute inset-0 w-full h-full ${
                isAIMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ManualMode 
                sections={sections}
                activeIndex={activeIndex}
                sectionRefs={sectionRefs}
              />
            </div>

            {/* AI Mode View */}
            <div
              className={`transition-opacity duration-500 ease-in-out absolute inset-0 w-full h-full ${
                !isAIMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <AIMode />
            </div>
          </main>
        </div>

        {/* Scroll Right Indicator for Classic Mode */}
        <div
          className={`fixed top-1/2 right-4 md:right-8 transform -translate-y-1/2 transition-opacity duration-500 z-30 ${!isAIMode && activeIndex === 0 ? 'opacity-100 animate-fade-in' : 'opacity-0 pointer-events-none'}`}
          aria-hidden="true"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-accent animate-bounce-right"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
          >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;