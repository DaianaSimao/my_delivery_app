import React from 'react';
import { MapPin, Home, CreditCard, Wallet, QrCode, DollarSign, Loader2 } from 'lucide-react';

interface DeliveryOptionsProps {
  selectedDelivery: string | null;
  selectedPayment: string | null;
  onDeliveryChange: (delivery: string) => void;
  onPaymentChange: (payment: string) => void;
  onTrocoChange: (troco: string) => void;
  onSubmit: () => void;
  isProcessingOrder?: boolean;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedDelivery,
  selectedPayment,
  onDeliveryChange,
  onPaymentChange,
  onTrocoChange,
  onSubmit,
  isProcessingOrder = false,
}) => {
  const deliveryOptions = [
    {
      id: 'Delivery',
      title: 'Entrega',
      description: 'Receba em casa',
      icon: <MapPin className="w-6 h-6" />,
    }
    // {
    //   id: 'Retirada',
    //   title: 'Retirada',
    //   description: 'Retire no local',
    //   icon: <Home className="w-6 h-6" />,
    // },
  ];

  const paymentMethods = [
    { id: 'credit', title: 'Cartão de Crédito', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'debit', title: 'Cartão de Débito', icon: <Wallet className="w-6 h-6" /> },
    { id: 'pix', title: 'PIX', icon: <QrCode className="w-6 h-6" /> },
    { id: 'cash', title: 'Dinheiro', icon: <DollarSign className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Escolha a Forma de Entrega</h3>
        {deliveryOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onDeliveryChange(option.id)}
            className={`w-full p-4 rounded-lg border ${
              selectedDelivery === option.id
                ? 'border-red-600 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-700'
            } flex items-center space-x-4`}
          >
            <div className={`${
              selectedDelivery === option.id
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {option.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900 dark:text-white">{option.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedDelivery && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Escolha a Forma de Pagamento</h3>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onPaymentChange(method.id)}
              className={`w-full p-4 rounded-lg border ${
                selectedPayment === method.id
                  ? 'border-red-600 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-700'
              } flex items-center space-x-4`}
            >
              <div className={`${
                selectedPayment === method.id
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {method.icon}
              </div>
              <p className="flex-1 text-left font-medium text-gray-900 dark:text-white">{method.title}</p>
            </button>
          ))}
        </div>
      )}

      {selectedPayment === 'cash' && (
        <div className="space-y-2">
          <label htmlFor="troco" className="block font-medium text-gray-900 dark:text-white">
            Precisa de Troco?
          </label>
          <input
            type="number"
            id="troco"
            onChange={(e) => onTrocoChange(e.target.value)}
            placeholder="Valor para troco"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
          />
        </div>
      )}

      {selectedDelivery && selectedPayment && (
        <button
          onClick={onSubmit}
          disabled={isProcessingOrder}
          className={`w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg transition-colors
            ${isProcessingOrder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
        >
          {isProcessingOrder ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </span>
          ) : (
            'Finalizar Pedido'
          )}
        </button>
      )}
    </div>
  );
};

export default DeliveryOptions;