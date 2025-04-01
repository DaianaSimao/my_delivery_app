import React from 'react';
import orderIcon from "/icons/order.svg";
import deliveryIcon from "/icons/delivery.svg";
import payIcon from "/icons/pay.svg";
import userIcon from "/icons/user.svg";

interface OrderDetailsProps {
  orderId: number;
  deliveryMethod: string;
  paymentMethod: string;
  customerName: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  deliveryMethod,
  paymentMethod,
  customerName,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detalhes do Pedido</h2>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <img
            src={orderIcon}
            alt="Ícone do pedido"
            className="h-8 w-auto mr-3 text-4xl" 
          />
          <strong>Pedido #{orderId}</strong>
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <img
            src={deliveryIcon}
            alt="Ícone do delivery"
            className="h-8 w-auto mr-3 text-4xl" 
          />
          <strong>{deliveryMethod}</strong>
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <img
            src={payIcon}
            alt="Ícone do pagamento"
            className="h-8 w-auto mr-3 text-4xl" 
          />
          <strong>Pagamento:&nbsp;</strong> {paymentMethod}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <img
            src={userIcon}
            alt="Ícone do cliente"
            className="h-8 w-auto mr-3 text-4xl" 
          />
          <strong>Cliente:&nbsp;</strong> {customerName || 'Cliente'}
        </p>
      </div>
    </div>
  );
};
