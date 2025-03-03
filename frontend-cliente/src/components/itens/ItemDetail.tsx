import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Moon,
  Sun,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '../../services/api';
import type { MenuItem, CartItem } from '../../types';

interface ItemDetailsProps {
  onAddToCart: (item: CartItem) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ onAddToCart }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [observation, setObservation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const updateQuantity = (optionId: number, increment: boolean) => {
    setSelectedOptions((prev) => {
      const currentValue = prev[optionId] || 0;
      const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
      return { ...prev, [optionId]: newValue };
    });
  };

  // Calcula o preço total: preço base + soma dos acompanhamentos selecionados
  const totalPrice = Object.entries(selectedOptions).reduce((total, [optionId, quantity]) => {
    const option = item?.produto_acompanhamentos
      .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
      .find((opt) => opt.id === Number(optionId));
    return total + (option?.preco || 0) * quantity;
  }, item?.preco ? parseFloat(item.preco.toString()) : 0);

  const handleAddToCart = () => {
    if (item) {
      // Gera uma key única concatenando o id do produto com o timestamp atual
      const uniqueId = `${item.id}-${new Date().getTime()}`;
      const cartItem: CartItem = {
        id: uniqueId,
        name: item.nome,
        price: totalPrice,
        quantity: 1,
        image: item.imagem_url,
        options: Object.entries(selectedOptions)
          .filter(([_, quantity]) => quantity > 0)
          .map(([optionId, quantity]) => {
            const option = item.produto_acompanhamentos
              .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
              .find((opt) => opt.id === Number(optionId));
            return `${option?.nome} (${quantity}x)`;
          }),
        observation: observation,
        nome: '',
        descricao: '',
        preco: 0,
        imagem_url: '',
        disponivel: '',
        produto_acompanhamentos: []
      };
      onAddToCart(cartItem);
      navigate('/cart');
    }
  };

  if (!item) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="pb-24">
          {/* Imagem do produto */}
          <div className="relative h-72">
            <img
              src={item.imagem_url}
              alt={item.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
                >
                  {darkMode ? (
                    <Sun className="w-6 h-6 text-gray-800 dark:text-white" />
                  ) : (
                    <Moon className="w-6 h-6 text-gray-800 dark:text-white" />
                  )}
                </button>
                <button className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full">
                  <Share2 className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Informações do produto */}
          <div className="px-4 py-6 bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.nome}
            </h1>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">
              R$ {item.preco}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {item.descricao}
            </p>

            {/* Acompanhamentos e opções */}
            <div className="space-y-6 mt-6">
              {item.produto_acompanhamentos.map(({ acompanhamento }) => (
                <div
                  key={acompanhamento.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleGroup(acompanhamento.id)}
                    className="w-full px-4 py-3 flex justify-between bg-gray-50 dark:bg-gray-800"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {acompanhamento.nome}
                    </h3>
                    {expandedGroups.includes(acompanhamento.id) ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>

                  {expandedGroups.includes(acompanhamento.id) && (
                    <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                      {acompanhamento.item_acompanhamentos.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex gap-4 flex-1">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {option.nome}
                              </h4>
                              {option.preco && (
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                  + R$ {option.preco}
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

            {/* Observações */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Observações
              </h3>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Alguma observação especial? Ex: Sem wasabi"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer com total e botão de avançar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                R$ {totalPrice}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
