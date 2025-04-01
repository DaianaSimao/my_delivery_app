import React from 'react';

interface OrderStep {
  key: string;
  label: string;
  description: string;
  completed: boolean;
}

interface OrderStatusStepsProps {
  currentStatus: string;
}

export const OrderStatusSteps: React.FC<OrderStatusStepsProps> = ({ currentStatus }) => {
  const statusSteps: OrderStep[] = [
    { 
      key: 'Recebido', 
      label: 'Pedido Recebido', 
      description: 'Seu pedido foi recebido pelo estabelecimento.', 
      completed: true 
    },
    { 
      key: 'Em Preparação', 
      label: 'Pedido em Preparação', 
      description: 'Seu pedido está sendo preparado.', 
      completed: currentStatus === 'Em Preparação' || currentStatus === 'Em entrega' || currentStatus === 'Entregue' || currentStatus === 'Expedido' 
    },
    { 
      key: 'Em entrega', 
      label: 'Saiu para Entrega', 
      description: 'Seu pedido está a caminho.', 
      completed: currentStatus === 'Em entrega' || currentStatus === 'Entregue' 
    },
    { 
      key: 'Entregue', 
      label: 'Pedido Entregue', 
      description: 'Seu pedido foi entregue com sucesso.', 
      completed: currentStatus === 'Entregue' 
    },
  ];

  return (
    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
      {statusSteps.map((step, index) => (
        <li key={step.key} className={`mb-10 ms-6 ${index === statusSteps.length - 1 ? '' : 'pb-4'}`}> 
          <span className={`absolute flex items-center justify-center w-8 h-8 ${step.completed ? 'bg-green-200 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'} rounded-full -start-4 ring-4 ring-white dark:ring-gray-900`}>
            <svg className={`w-3.5 h-3.5 ${step.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
          </span>
          <h3 className="font-medium leading-tight">{step.label}</h3>
          <p className="text-sm">{step.description}</p>
        </li>
      ))}
    </ol>
  );
};
