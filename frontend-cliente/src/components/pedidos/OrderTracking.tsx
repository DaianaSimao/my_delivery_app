import React, { useState, useEffect } from 'react';
import { fetchRestaurantInfo } from '../../services/api';
import type { Restaurante } from '../../types';
import { createConsumer } from '@rails/actioncable'; // Importação do ActionCable

const OrderTracking: React.FC = () => {
  // Ajuste o tipo do estado para refletir os status do backend
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restauranteId = localStorage.getItem('restauranteId');
  const pedido = JSON.parse(localStorage.getItem('pedido') || '{}');
  const clienteNome = pedido.data.cliente.nome
  const [orderStatus, setOrderStatus] = useState(pedido.data.status || 'Recebido');

  // Configuração do ActionCable
  useEffect(() => {
    const restauranteId = localStorage.getItem('restauranteId'); // Obtém o restaurante_id do localStorage
    const pedidoId = pedido.data.id; // Obtém o ID do pedido
    // Monta a URL do WebSocket com o restaurante_id
    const cable = createConsumer(`ws://localhost:3000/cable?restaurante_id=${restauranteId}`);
  
    const subscription = cable.subscriptions.create(
      { channel: 'PedidoStatusChannel', pedido_id: pedidoId }, // Inscreve-se no canal do pedido
      {
        received: (data: { status: 'Recebido' | 'Em Preparação' | 'Em entrega' | 'Entregue' }) => {
          console.log('Dados recebidos:', data); // Log para verificar os dados recebidos
          setOrderStatus(data.status); // Atualiza o estado do pedido com o novo status recebido
        },
        connected: () => {
          console.log('Conectado ao WebSocket'); // Log para verificar a conexão
        },
        disconnected: () => {
          console.log('Desconectado do WebSocket'); // Log para verificar a desconexão
        },
      }
    );
  
    // Limpeza ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, [pedido.data.id]); // Dependência: ID do pedido

  // Carrega as informações do restaurante
  useEffect(() => {
    const loadRestaurantInfo = async () => {
      try {
        if (restauranteId) {
          const data = await fetchRestaurantInfo(restauranteId);
          setRestaurantInfo(data);
        } else {
          throw new Error('Restaurante ID não fornecido.');
        }
      } catch (error) {
        console.error('Erro ao carregar informações do restaurante:', error);
        setError('Erro ao carregar informações do restaurante.');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantInfo();
  }, [restauranteId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurantInfo) {
    return <div>Nenhuma informação do restaurante encontrada.</div>;
  }

  // Ajuste os passos do status para refletir os status do backend
  const statusSteps = [
    { key: 'Recebido', label: 'Pedido Recebido', description: 'Seu pedido foi recebido pelo estabelecimento.', completed: orderStatus == 'Recebido' },
    { key: 'Em Preparação', label: 'Pedido em Preparação', description: 'Seu pedido está sendo preparado.', completed: orderStatus == 'Em Preparação' || orderStatus == 'Expedido' },
    { key: 'Em entrega', label: 'Saiu para Entrega', description: 'Seu pedido está a caminho.', completed: orderStatus === 'Em Entrega' },
    { key: 'Entregue', label: 'Pedido Entregue', description: 'Seu pedido foi entregue com sucesso.', completed: orderStatus === "Entregue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">{restaurantInfo.nome}</h1>
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
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detalhes do Pedido</h2>
          <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300"><strong>Pedido #{pedido.data.id}</strong></p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Entrega:</strong> {pedido.data.forma_entrega}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Pagamento:</strong> {pedido.data.forma_pagamento}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Cliente:</strong> {clienteNome}</p>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Entre em Contato
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;