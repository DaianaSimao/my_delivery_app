import type { MenuSection } from '../../types';

interface SectionNavigationProps {
  sections: MenuSection[];
  onSectionClick: (sectionId: string) => void;
  activeSection?: string;
}

export function SectionNavigation({ sections, onSectionClick, activeSection }: SectionNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md pb-2 pt-3">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto mt1">
        <div className="flex space-x-4">
          {sections.map((section) => (
            <button
              key={section.id}
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
    </div>
  );
} 