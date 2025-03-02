import React from 'react';
import { ArrowLeft, Trash2, Pencil, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onBack: () => void;
  onClearCart: () => void;
  onEditItem: (item: CartItem) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onAddMore: () => void;
  onCheckout: () => void;
}

export function Cart({
  items,
  onBack,
  onClearCart,
  onEditItem,
  onRemoveItem,
  onUpdateQuantity,
  onAddMore,
  onCheckout,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Carrinho</h1>
          <button
            onClick={onClearCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Trash2 className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex gap-4">
                {/* Image and Edit Button */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => onEditItem(item)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.quantity}x {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        R$ {item.price}
                      </p>
                      {item.options && item.options.length > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.options.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ml-2"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add More Items Button */}
          <button
            onClick={onAddMore}
            className="w-full py-3 bg-white dark:bg-gray-800 text-primary-500 font-semibold rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Adicionar mais produtos
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                R$ {total}
              </p>
            </div>
            <button
              onClick={onCheckout}
              className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}