import React from 'react';
import { OrderItem } from '../../types/OrderItem';

interface OrderSummaryProps {
  cartItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  formData: {
    firstName: string;
    lastName: string;
    whatsapp: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    reference: string;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  deliveryFee,
  total,
  formData,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dados do Cliente</h4>
        <div className="space-y-1">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Nome:</span> {formData.firstName} {formData.lastName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">WhatsApp:</span> {formData.whatsapp}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Endereço de Entrega</h4>
        <div className="space-y-1">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Rua:</span> {formData.street}, {formData.number}
          </p>
          {formData.complement && (
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Complemento:</span> {formData.complement}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Bairro:</span> {formData.neighborhood}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Cidade:</span> {formData.city}
          </p>
          {formData.reference && (
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Ponto de Referência:</span> {formData.reference}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.quantity}x {item.name}
                </p>
                {item.options && item.options.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {item.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        • {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="font-medium text-red-600 dark:text-red-400">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>R$ {Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Taxa de entrega</span>
          <span>
            {Number(deliveryFee) === 0
              ? "Grátis"
              : `R$ ${Number(deliveryFee).toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-lg">
          <span>Total</span>
          <span className="text-red-600 dark:text-red-400">R$ {Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;