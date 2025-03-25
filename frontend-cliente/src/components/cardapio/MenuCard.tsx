// src/components/cardapio/MenuCard.tsx
import type { MenuItem } from '../../types';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export function MenuCard({ item, onClick }: MenuCardProps) {

  return (
    <div 
      onClick={() => onClick(item)}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imagem_url}
          alt={item.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {item.promocao && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {item.promocao.tipo === 'desconto_percentual' 
              ? `${item.promocao.desconto_percentual}% OFF`
              : 'PROMOÇÃO'}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{item.nome}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2 min-h-[3rem]">
          {item.descricao}
        </p>
        {/* Preços */}
        <div className="flex items-center gap-2 justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            R$ {Number(item.preco).toFixed(2)}
          </span>
          {item.preco_original && (
            <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
              R$ {Number(item.preco_original).toFixed(2)}
            </span>
          )}
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full">
            Popular
          </span>
        </div>
        
      </div>
    </div>
  );
}