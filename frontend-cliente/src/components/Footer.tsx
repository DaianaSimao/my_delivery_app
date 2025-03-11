import { Home, ShoppingCart, Truck } from 'lucide-react'; // Adicionei Truck para o ícone de rastreamento
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  onCartClick: () => void;
}

export function Footer({ onCartClick }: FooterProps) {
  const navigate = useNavigate();

  const handleOrderTrackingClick = () => {
    navigate('/order-tracking');
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <Home className="h-6 w-6" />
            <span className="text-sm mt-1">Início</span>
          </a>

          {/* Botão central para Order Tracking */}
          <button
            onClick={handleOrderTrackingClick}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <Truck className="h-6 w-6" />
            <span className="text-sm mt-1">Rastrear</span>
          </button>

          <button
            onClick={onCartClick}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-sm mt-1">Carrinho</span>
          </button>
        </div>
      </div>
    </footer>
  );
}