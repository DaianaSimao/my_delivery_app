import React from 'react';
import { MenuCard } from './MenuCard';
import type { MenuItem, MenuSection as MenuSectionType } from '../types';

interface MenuSectionProps {
  section: MenuSectionType;
  onItemClick: (item: MenuItem) => void;
}

export function MenuSection({ section, onItemClick }: MenuSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.items.map((item) => (
          <MenuCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
}