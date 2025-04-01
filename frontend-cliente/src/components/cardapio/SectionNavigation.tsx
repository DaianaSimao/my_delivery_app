import type { MenuSection } from '../../types';
import { useEffect, useRef } from 'react';

interface SectionNavigationProps {
  sections: MenuSection[];
  onSectionClick: (sectionId: string) => void;
  activeSection?: string;
}

export function SectionNavigation({ sections, onSectionClick, activeSection }: SectionNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeButtonRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeButtonRef.current;
      
      const containerWidth = container.offsetWidth;
      const buttonWidth = button.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [activeSection]);

  return (
    <nav className="px-4 sm:px-6 lg:px-8 py-2">
      <div className="overflow-x-auto scrollbar-hide" ref={containerRef}>
        <div className="flex space-x-4 w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              ref={activeSection === section.id ? activeButtonRef : null}
              onClick={() => onSectionClick(section.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeSection === section.id 
                  ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}