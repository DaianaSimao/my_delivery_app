// OrderTracking.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRestaurantInfo, fetchPedidoById } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../hooks/useTheme';
import { createConsumer } from '@rails/actioncable';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { Header } from '../shared/Header';
import { OrderStatusSteps } from './OrderStatusSteps';
import { OrderDetails } from './OrderDetails';
import type { Restaurante } from '../../types';
import type { PedidoSalvo } from '../../types/PedidoData';

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const restauranteId = localStorage.getItem('restauranteId');
  const [restaurantInfo, setRestaurantInfo] = React.useState<Restaurante | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pedido, setPedido] = React.useState<PedidoSalvo | null>(null);
  const [pedidoConcluido, setPedidoConcluido] = React.useState(false);
  const [orderStatus, setOrderStatus] = React.useState<string>('Recebido');

  const handleBack = () => {
    if (restauranteId) {
      navigate(`/cardapio/${restauranteId}`);
    } else {
      navigate('/');
    }
  };

  const handlePedidoConcluido = () => {
    localStorage.removeItem('pedidoId');
    localStorage.removeItem('pedido');
    if (restauranteId) {
      navigate(`/cardapio/${restauranteId}`);
    } else {
      navigate('/');
    }
  };

  const fetchPedidoAtual = async () => {
    const pedidoIdSalvo = localStorage.getItem('pedidoId');
    
    if (!pedidoIdSalvo) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await fetchPedidoById(pedidoIdSalvo);
      setPedido({ data });
      setOrderStatus(data.status);
      
      if (data.status === 'Entregue') {
        setPedidoConcluido(true);
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      setError('Não foi possível carregar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    clearCart();
    fetchPedidoAtual();
  }, []);

  React.useEffect(() => {
    if (!pedido?.data?.id) return;

    const pedidoId = pedido.data.id;
    
    if (!restauranteId || !pedidoId) return;

    const cable = createConsumer(`ws://localhost:3000/cable?restaurante_id=${restauranteId}`);
    const subscription = cable.subscriptions.create(
      { channel: 'PedidoStatusChannel', pedido_id: pedidoId },
      {
        received: (data: { status: string }) => {
          setOrderStatus(data.status);
          
          if (data.status === 'Entregue') {
            setPedidoConcluido(true);
            subscription.unsubscribe();
          }
        },
        connected: () => console.log('Conectado ao WebSocket'),
        disconnected: () => console.log('Desconectado do WebSocket'),
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [pedido?.data?.id, restauranteId]);

  React.useEffect(() => {
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
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <p className="text-red-500 text-center mb-4">{error}</p>
            <button 
              onClick={handleBack}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            >
              Voltar para o cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!restaurantInfo) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <p className="dark:text-white text-center mb-4">Nenhuma informação do restaurante encontrada.</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <Header onBack={handleBack} />
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhum pedido no momento</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Que tal pedir algo delicioso hoje?
            </p>
            <Link 
              to={restauranteId ? `/cardapio/${restauranteId}` : '/'}
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Ver cardápio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (pedidoConcluido) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <Header onBack={handleBack} />
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Seu pedido foi entregue!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esperamos que esteja tudo delicioso! Agora é só aproveitar sua refeição.
              <br /><br />
              <span className="font-medium text-primary-500">Bom apetite! 😋</span>
            </p>
            
            <button 
              onClick={handlePedidoConcluido}
              className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Voltar para o cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Header onBack={handleBack} />
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">{restaurantInfo.nome}</h1>
          
          <OrderStatusSteps currentStatus={orderStatus} />
          
          <OrderDetails 
            orderId={pedido.data.id}
            deliveryMethod={pedido.data.forma_entrega}
            paymentMethod={pedido.data.forma_pagamento}
            customerName={pedido.data.cliente?.nome}
          />

          <div className="mt-6">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Entre em Contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;