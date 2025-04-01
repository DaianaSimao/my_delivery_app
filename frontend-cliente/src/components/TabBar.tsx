import type { MenuSection } from '../types';

interface TabBarProps {
  sections: MenuSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function TabBar({ sections, activeSection, onSectionChange }: TabBarProps) {
  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`section[data-section-id="${sectionId}"]`);
    if (section) {
      const headerOffset = 120;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    onSectionChange(sectionId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[116px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeSection === section.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}