import React, { useRef, useMemo } from 'react';
import type { SkillInfo } from './SkillInfo';

interface SkillBadgeProps {
  skill: string;
  large?: boolean;
  icon?: SkillInfo['icon'];
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, large = false, icon }) => {
  const badgeRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = badgeRef.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const maxRotate = large ? 8 : 12;

    const rotateX = -((y - height / 2) / (height / 2)) * maxRotate;
    const rotateY = ((x - width / 2) / (width / 2)) * maxRotate;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
    // Use a quick, linear transition when following the mouse for responsiveness
    el.style.transition = 'transform 0.1s linear';
  };

  const handleMouseLeave = () => {
    const el = badgeRef.current;
    if (!el) return;

    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    // Use a bouncy, slower transition when resetting to feel more natural
    el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  };


  const sizeClasses = large ? 'py-2 px-4 text-base' : 'py-1 px-3 text-xs';
  const iconSize = large ? 'h-5 w-5' : 'h-4 w-4';

  const iconUrl = useMemo(() => {
    if (!icon) {
      return '';
    }
    if (icon.source === 'external') {
      return icon.url;
    }
    // It's a Devicon
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon.slug}/${icon.slug}-${icon.variant}.svg`;
  }, [icon]);

  return (
    <span
      ref={badgeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={`
        inline-flex items-center gap-2 bg-primary border border-accent/30 text-accent 
        rounded-full font-medium ${sizeClasses} 
        transform-gpu
        transition-colors transition-shadow duration-300
        hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20
      `}
    >
      {icon && (
        <div
          aria-hidden="true"
          className={iconSize}
          style={{
            transform: 'translateZ(20px)',
            backgroundColor: 'currentColor',
            maskImage: `url(${iconUrl})`,
            WebkitMaskImage: `url(${iconUrl})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }}
        />
      )}
      <span style={{ transform: 'translateZ(10px)' }}>{skill}</span>
    </span>
  );
};

export default SkillBadge;