import React, { useState, useEffect, useMemo } from 'react';
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
import { useTheme } from '../../hooks/useTheme';
import { formatPrice } from '../../utils/formatters';

interface ItemDetailsProps {
  onAddToCart: (item: CartItem) => void;
  itemToEdit?: CartItem | null;
  onEditItem?: (originalItemId: string, updatedItem: CartItem) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ onAddToCart, itemToEdit, onEditItem }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [observation, setObservation] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalItemId, setOriginalItemId] = useState<string>('');
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const loadProductDetails = async () => {
      if (itemId) {
        try {
          const data = await fetchProductDetails(Number(itemId));
          setItem({
            ...data,
            preco_original: data.preco_original || data.preco
          });
          console.log('Detalhes do produto:', data);
        } catch (error) {
          console.error('Erro ao carregar detalhes do produto:', error);
        }
      }
    };
    loadProductDetails();
  }, [itemId]);

  useEffect(() => {
    if (itemToEdit) {
      setIsEditMode(true);
      setOriginalItemId(itemToEdit.id);
      setObservation(itemToEdit.observation || '');
      
      if (itemToEdit.acompanhamentos && itemToEdit.acompanhamentos.length > 0) {
        const optionsMap: Record<number, number> = {};
        itemToEdit.acompanhamentos.forEach((acomp: { id: any; quantidade: number; }) => {
          optionsMap[Number(acomp.id)] = acomp.quantidade;
        });
        setSelectedOptions(optionsMap);
      }
      
      if (item?.produto_acompanhamentos) {
        setExpandedGroups(item.produto_acompanhamentos.map(pa => pa.acompanhamento.id));
      }
    }
  }, [itemToEdit, item]);

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getTotalSelectedInGroup = (acompanhamentoId: number): number => {
    let total = 0;
    const options = item?.produto_acompanhamentos
      .find(pa => pa.acompanhamento.id === acompanhamentoId)
      ?.acompanhamento.item_acompanhamentos || [];
      
    options.forEach(option => {
      total += selectedOptions[option.id] || 0;
    });
    return total;
  };

  const updateQuantity = (optionId: number, increment: boolean, acompanhamentoId: number) => {
    setSelectedOptions((prev) => {
      const currentValue = prev[optionId] || 0;
      if (increment) {
        const acompanhamento = item?.produto_acompanhamentos
          .find(pa => pa.acompanhamento.id === acompanhamentoId)?.acompanhamento;
        const totalSelected = getTotalSelectedInGroup(acompanhamentoId);
        if (totalSelected >= (acompanhamento?.quantidade_maxima || 0)) {
          return prev;
        }
      }
      const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
      return { ...prev, [optionId]: newValue };
    });
  };

  const calculateTotalPrice = useMemo(() => {
    if (!item) return 0;
    
    const basePrice = Number(item.preco) || 0;
    const accompanimentsTotal = Object.entries(selectedOptions).reduce((total, [optionId, quantity]) => {
      if (!quantity) return total;
      
      const option = item.produto_acompanhamentos
        .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
        .find((opt) => opt.id === Number(optionId));
      
      return total + (Number(option?.preco) || 0) * quantity;
    }, 0);
  
    return Number((basePrice + accompanimentsTotal).toFixed(2));
  }, [item, selectedOptions]);

  const handleSubmit = () => {
    if (item) {
      const cartItem: CartItem = {
        id: isEditMode ? originalItemId : `${item.id}-${new Date().getTime()}`,
        name: item.nome,
        price: calculateTotalPrice,
        quantity: isEditMode ? (itemToEdit?.quantity || 1) : 1,
        image: item.imagem_url,
        preco: item.preco,
        preco_original: item.promocao ? item.preco_original : item.preco, 
        promocao: item.promocao,
        options: Object.entries(selectedOptions)
          .filter(([_, quantity]) => quantity > 0)
          .map(([optionId, quantity]) => {
            const option = item.produto_acompanhamentos
              .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
              .find((opt) => opt.id === Number(optionId));
            return `${option?.nome} (${quantity}x) - R$ ${formatPrice(Number(option?.preco))}`;
          }),
        observation: observation,
        acompanhamentos: Object.entries(selectedOptions)
          .filter(([_, quantity]) => quantity > 0)
          .map(([optionId, quantity]) => ({
            id: optionId,
            nome: item.produto_acompanhamentos
              .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
              .find((opt) => opt.id === Number(optionId))?.nome || '',
            preco: item.produto_acompanhamentos
              .flatMap(({ acompanhamento }) => acompanhamento.item_acompanhamentos)
              .find((opt) => opt.id === Number(optionId))?.preco || 0,
            quantidade: quantity,
          })),
        nome: '',
        descricao: '',
        imagem_url: '',
        disponivel: '',
        produto_acompanhamentos: []
      };

      if (isEditMode && onEditItem) {
        onEditItem(originalItemId, cartItem);
      } else {
        onAddToCart(cartItem);
      }
      navigate('/cart');
    }
  };

  if (!item) return <div>Carregando...</div>;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
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
                  {isDarkMode ? (
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
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-2 flex items-center flex-wrap gap-2">
              {item.promocao ? (
                <>
                  <span className="text-gray-900 dark:text-white inline-flex items-center">
                    <span className="inline-block">R$</span>
                    <span className="inline-block ml-1">{formatPrice(Number(item.preco))}</span>
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through inline-flex items-center">
                    <span className="inline-block">R$</span>
                    <span className="inline-block ml-1">{formatPrice(Number(item.preco_original))}</span>
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                    {item.promocao.tipo === 'desconto_percentual' 
                      ? `${item.promocao.desconto_percentual}% OFF` 
                      : 'PROMOÇÃO'}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 dark:text-white inline-flex items-center">
                  <span className="inline-block">R$</span>
                  <span className="inline-block ml-1">{formatPrice(Number(item.preco))}</span>
                </span>
              )}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {item.descricao}
            </p>

            {/* Acompanhamentos e opções */}
            <div className="space-y-6 mt-6">
              {item.produto_acompanhamentos.map(({ acompanhamento }) => {
                const totalSelected = getTotalSelectedInGroup(acompanhamento.id);
                return (
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
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          ({totalSelected}/{acompanhamento.quantidade_maxima || 0})
                        </span>
                      </h3>
                      {expandedGroups.includes(acompanhamento.id) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>

                    {expandedGroups.includes(acompanhamento.id) && (
                      <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                        {acompanhamento.item_acompanhamentos.map((option) => {
                          const maxReached = getTotalSelectedInGroup(acompanhamento.id) >= (acompanhamento.quantidade_maxima || 0);
                          return (
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
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400 inline-flex items-center">
                                      <span className="inline-block">+ R$</span>
                                      <span className="inline-block ml-1">{formatPrice(Number(option.preco))}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(option.id, false, acompanhamento.id)}
                                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                  {selectedOptions[option.id] || 0}
                                </span>
                                <button
                                  onClick={() => updateQuantity(option.id, true, acompanhamento.id)}
                                  disabled={maxReached && !(selectedOptions[option.id] || 0)}
                                  className={`p-1 rounded-full ${
                                    maxReached && !(selectedOptions[option.id] || 0)
                                      ? 'bg-gray-300 dark:bg-red-800 cursor-not-allowed'
                                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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
              <p className="text-xl font-bold text-gray-900 dark:text-white inline-flex items-center">
                <span className="inline-block">R$</span>
                <span className="inline-block ml-1">{formatPrice(calculateTotalPrice)}</span>
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              {isEditMode ? 'Atualizar' : 'Avançar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
