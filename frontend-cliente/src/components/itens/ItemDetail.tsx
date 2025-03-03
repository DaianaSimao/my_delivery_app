import React, { useState } from 'react';
import { ArrowLeft, Share2, ChevronDown, ChevronUp, Plus, Minus, Moon, Sun } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '../../services/api';
import type { MenuItem } from '../../types';

const ItemDetails: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadProductDetails = async () => {
      if (itemId) {
        try {
          const data = await fetchProductDetails(Number(itemId));
          setItem(data);
        } catch (error) {
          console.error('Erro ao carregar detalhes do produto:', error);
        }
      }
    };

    loadProductDetails();
  }, [itemId]);

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

  if (!item) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="relative h-72">
          <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div className="flex gap-2">
              <button className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full">
                <Share2 className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 bg-white dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.nome}</h1>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">R$ {item.preco}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{item.descricao}</p>

          <div className="space-y-6 mt-6">
            {item.produto_acompanhamentos.map(({ acompanhamento }) => (
              <div key={acompanhamento.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleGroup(acompanhamento.id)} 
                  className="w-full px-4 py-3 flex justify-between bg-gray-50 dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{acompanhamento.nome}</h3>
                  {expandedGroups.includes(acompanhamento.id) ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedGroups.includes(acompanhamento.id) && (
                  <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                    {acompanhamento.item_acompanhamentos.map((option) => (
                      <div key={option.id} className="flex items-center justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{option.nome}</h4>
                            {option.preco && (
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                + R$ {option.preco.toFixed(2)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;