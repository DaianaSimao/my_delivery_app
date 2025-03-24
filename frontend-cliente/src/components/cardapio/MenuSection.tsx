import { PopularItemsCarousel } from './PopularItemsCarousel';
import { ListItemCard } from './ListItemCard';
import type { MenuItem, MenuSection as MenuSectionType } from '../../types';

interface MenuSectionProps {
  section: MenuSectionType;
  onItemClick: (item: MenuItem) => void;
  id: string;
}

export function MenuSection({ section, onItemClick, id}: MenuSectionProps) {
  if (section.id === 'popular') {
    return (
      <section id={id} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{section.title}</h2>
        <PopularItemsCarousel items={section.items} onClick={(item) => onItemClick(item)} />
      </section>
    );
  }

  return (
    <section id={id} className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{section.title}</h2>
      <div className="space-y-4">
        {section.items.map((item) => (
          <ListItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </section>
  );
}