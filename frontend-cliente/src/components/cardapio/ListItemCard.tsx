import type { MenuItem } from '../../types';

interface ListItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export function ListItemCard({ item, onClick }: ListItemCardProps) {

  return (
    <div 
      onClick={() => onClick(item)}
      className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
          {item.nome}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{item.descricao}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            R$ {Number(item.preco).toFixed(2)}
          </span>
          {item.preco_original && (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                R$ {Number(item.preco_original).toFixed(2)}
              </span>
              <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                {item.promocao?.tipo === 'desconto_percentual'
                  ? `${item.promocao.desconto_percentual}% OFF`
                  : 'PROMO'}
              </span>
            </>
          )}
        </div>
      </div>
      
      <div className="w-32 h-32 flex-none">
        <img
          src={item.imagem_url}
          alt={item.nome}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}