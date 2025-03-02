import React, { useState, useEffect } from 'react';
import { MenuSection as MenuSectionComponent } from './components/MenuSection';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TabBar } from './components/TabBar';
import { Utensils } from 'lucide-react';
import type { MenuItem, MenuSection, RestaurantInfo } from './types';

const restaurantInfo: RestaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#"
};

// Sample data - replace with actual API data later
const menuSections: MenuSection[] = [
  {
    id: "popular",
    title: "Os Mais Pedidos",
    items: [
      {
        id: "1",
        name: "Sushi Especial",
        description: "Combinação premium com 8 peças de sushi variado, incluindo salmão, atum e peixe branco.",
        price: 45.90,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "sushi",
        popular: true
      },
      {
        id: "2",
        name: "Combo Dragon Roll",
        description: "Roll especial coberto com fatias de salmão maçaricado e cream cheese.",
        price: 52.90,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "rolls",
        popular: true
      }
    ]
  },
  {
    id: "promotions",
    title: "Promoções",
    items: [
      {
        id: "3",
        name: "Festival de Temaki",
        description: "3 temakis de salmão com cream cheese por um preço especial.",
        price: 39.90,
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "temaki",
        promotion: {
          discountPercentage: 20,
          originalPrice: 49.90
        }
      }
    ]
  },
  {
    id: "regular",
    title: "Cardápio Completo",
    items: [
      {
        id: "4",
        name: "Hot Philadelphia",
        description: "Roll empanado com salmão, cream cheese e cebolinha.",
        price: 32.90,
        image: "https://images.unsplash.com/photo-1676037150408-4b59a542fa7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "hot"
      }
    ]
  }
];

function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState(menuSections[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    // TODO: Implement item details modal/page
    console.log('Selected item:', item);
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-section-id]');
      let currentSection = menuSections[0].id;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) { // Adjust this value based on header height
          currentSection = section.getAttribute('data-section-id') || menuSections[0].id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Header 
        restaurantInfo={restaurantInfo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <TabBar 
        sections={menuSections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {menuSections.map((section) => (
          <section key={section.id} data-section-id={section.id}>
            <MenuSectionComponent section={section} onItemClick={handleItemClick} />
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default App