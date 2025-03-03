// src/components/cardapio/MenuCard.tsx
import type { MenuItem } from '../../types';
import { Footer } from '../Footer';
import { useState } from 'react';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export function MenuCard({ item, onClick }: MenuCardProps) {
  const displayPrice = item.preco;
  const [showCart, setShowCart] = useState(false);

  return (
    <div 
      onClick={() => onClick(item)}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imagem_url}
          alt={item.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            10% OFF
          </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{item.nome}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{item.descricao}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">R$ {displayPrice}</span>
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                R$ {item.preco}
              </span>
          </div>
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full">
              Popular
            </span>
        </div>
      </div>
      <Footer onCartClick={() => setShowCart(true)} />
    </div>
  );
}