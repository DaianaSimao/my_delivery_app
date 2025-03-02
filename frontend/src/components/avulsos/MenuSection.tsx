import React from 'react';
import { MenuCard } from './MenuCard';
import { PopularItemsCarousel } from './PopularItemsCarousel';
import { ListItemCard } from './ListItemCard';
import type { MenuItem, MenuSection as MenuSectionType } from '../../types';

interface MenuSectionProps {
  section: MenuSectionType;
  onItemClick: (item: MenuItem) => void;
}

export function MenuSection({ section, onItemClick }: MenuSectionProps) {
  if (section.id === 'popular') {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{section.title}</h2>
        <PopularItemsCarousel items={section.items} onItemClick={onItemClick} />
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{section.title}</h2>
      <div className="space-y-4">
        {section.items.map((item) => (
          <ListItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
}