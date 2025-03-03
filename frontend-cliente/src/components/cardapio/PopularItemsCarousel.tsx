import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuCard } from './MenuCard';
import type { MenuItem } from '../../types';

interface PopularItemsCarouselProps {
  items: MenuItem[];
  onClick: (item: MenuItem) => void;
}

export function PopularItemsCarousel({ items, onClick}: PopularItemsCarouselProps) {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainer.current.scrollLeft - scrollAmount
        : scrollContainer.current.scrollLeft + scrollAmount;
      
      scrollContainer.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollContainer}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {items.map((item: MenuItem) => (
          <div key={item.id} className="flex-none w-80">
            <MenuCard item={item} onClick={() => onClick(item)} />
          </div>
        ))}
      </div>
      
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
}