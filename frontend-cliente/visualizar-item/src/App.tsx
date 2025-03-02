import React, { useState } from 'react';
import { ArrowLeft, Share2, ChevronDown, ChevronUp, Plus, Minus, Moon, Sun } from 'lucide-react';

interface Option {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
}

interface OptionGroup {
  id: number;
  title: string;
  maxSelections: number;
  options: Option[];
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [observation, setObservation] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1, 2, 3]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  const optionGroups: OptionGroup[] = [
    {
      id: 1,
      title: 'Escolha seu Combo',
      maxSelections: 1,
      options: [
        {
          id: 1,
          name: 'Combo Sushi Especial',
          description: '12 peças de sushi variado com salmão, atum e peixe branco',
          price: 89.90,
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500'
        }
      ]
    },
    {
      id: 2,
      title: 'Molhos',
      maxSelections: 3,
      options: [
        {
          id: 2,
          name: 'Shoyu',
          description: 'Molho de soja tradicional',
          price: 0
        },
        {
          id: 3,
          name: 'Molho Tarê',
          description: 'Molho agridoce especial da casa',
          price: 2.50
        }
      ]
    },
    {
      id: 3,
      title: 'Complementos',
      maxSelections: 4,
      options: [
        {
          id: 4,
          name: 'Gengibre Extra',
          description: 'Porção adicional de gengibre',
          price: 3.00
        },
        {
          id: 5,
          name: 'Wasabi Extra',
          description: 'Porção adicional de wasabi',
          price: 2.00
        }
      ]
    }
  ];

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const updateQuantity = (optionId: number, increment: boolean) => {
    setSelectedOptions(prev => {
      const currentValue = prev[optionId] || 0;
      const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
      return { ...prev, [optionId]: newValue };
    });
  };

  const filteredGroups = optionGroups.map(group => ({
    ...group,
    options: group.options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  const totalPrice = Object.entries(selectedOptions).reduce((total, [optionId, quantity]) => {
    const option = optionGroups
      .flatMap(group => group.options)
      .find(opt => opt.id === Number(optionId));
    return total + (option?.price || 0) * quantity;
  }, 89.90); // Base price of the combo

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header Image Section */}
        <div className="relative h-72">
          <img 
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000"
            alt="Sushi Combo"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <button className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div className="flex gap-2">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-gray-800 dark:text-white" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
                )}
              </button>
              <button className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="px-4 py-6 -mt-6 rounded-t-3xl bg-white dark:bg-gray-900 relative">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Combo Sushi Especial</h1>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">R$ 89,90</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            12 peças de sushi variado premium com salmão, atum e peixe branco. Acompanha shoyu, wasabi e gengibre.
          </p>

          {/* Search Bar */}
          <div className="mt-6 mb-4">
            <input
              type="text"
              placeholder="Buscar opções..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Option Groups */}
          <div className="space-y-6 mb-24">
            {filteredGroups.map(group => (
              <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{group.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Máximo: {group.maxSelections} {group.maxSelections === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  {expandedGroups.includes(group.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                
                {expandedGroups.includes(group.id) && (
                  <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                    {group.options.map(option => (
                      <div key={option.id} className="flex items-center justify-between">
                        <div className="flex gap-4 flex-1">
                          {option.image && (
                            <img
                              src={option.image}
                              alt={option.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                            {option.price > 0 && (
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                + R$ {option.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(option.id, false)}
                            className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {selectedOptions[option.id] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(option.id, true)}
                            className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Observation Field */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Observações</h3>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Alguma observação especial? Ex: Sem wasabi"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* Footer with Total and Continue Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  R$ {totalPrice.toFixed(2)}
                </p>
              </div>
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                Avançar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;