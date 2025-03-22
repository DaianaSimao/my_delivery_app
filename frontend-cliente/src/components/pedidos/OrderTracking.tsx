// OrderTracking.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRestaurantInfo, fetchPedidoById } from '../../services/api';
import { useCart } from '../../contexts/CartContext'; // Importar o contexto
import type { Restaurante } from '../../types';
import { createConsumer } from '@rails/actioncable';
import { ArrowLeft, Sun, Moon, Package, CheckCircle, ShoppingBag } from 'lucide-react';
import orderIcon from "/icons/order.svg";
import deliveryIcon from "/icons/delivery.svg";
import payIcon from "/icons/pay.svg";
import userIcon from "/icons/user.svg";

// Interface para dados do pedido
interface PedidoData {
  id: number;
  status: string;
  cliente: {
    nome: string;
  };
  forma_entrega: string;
  forma_pagamento: string;
}

// Interface para o pedido completo salvo
interface PedidoSalvo {
  data: PedidoData;
}

const OrderTracking: React.FC = () => {
  const { clearCart } = useCart();
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restauranteId = localStorage.getItem('restauranteId');
  const [pedido, setPedido] = useState<PedidoSalvo | null>(null);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>('Recebido');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  // Função para buscar o status atual do pedido
  const fetchPedidoAtual = async () => {
    const pedidoIdSalvo = localStorage.getItem('pedidoId');
    
    if (!pedidoIdSalvo) {
      // Não há pedido para rastrear
      setLoading(false);
      return;
    }
    
    try {
      // Buscar o pedido atualizado usando o serviço da API
      const data = await fetchPedidoById(pedidoIdSalvo);
      setPedido({ data });
      console.log('Pedido:', data);
      setOrderStatus(data.status);
      
      // Se o pedido já foi entregue, mostrar tela de conclusão
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

  useEffect(() => {
    // Limpar o carrinho ao abrir a página de rastreamento
    clearCart();
    
    // Buscar o pedido atual
    fetchPedidoAtual();
  }, []);

  useEffect(() => {
    // Conectar ao WebSocket apenas se tiver um pedido para rastrear
    if (!pedido?.data?.id) return;

    const pedidoId = pedido.data.id;
    
    if (!restauranteId || !pedidoId) return;

    const cable = createConsumer(`ws://localhost:3000/cable?restaurante_id=${restauranteId}`);
    const subscription = cable.subscriptions.create(
      { channel: 'PedidoStatusChannel', pedido_id: pedidoId },
      {
        received: (data: { status: string }) => {
          setOrderStatus(data.status);
          
          // Se o pedido foi entregue
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode((prevMode: any) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const handleBack = () => {
    if (restauranteId) {
      navigate(`/cardapio/${restauranteId}`);
    } else {
      navigate('/');
    }
  };

  const handlePedidoConcluido = () => {
    // Remover o pedido do localStorage
    localStorage.removeItem('pedidoId');
    localStorage.removeItem('pedido');
    
    // Redirecionar para o cardápio
    if (restauranteId) {
      navigate(`/cardapio/${restauranteId}`);
    } else {
      navigate('/');
    }
  };

  if (loading) return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={darkMode ? 'dark' : ''}>
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
  
  if (!restaurantInfo) return (
    <div className={darkMode ? 'dark' : ''}>
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

  // Se não há pedido para rastrear
  if (!pedido) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
          
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

  // Tela de pedido concluído
  if (pedidoConcluido) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
          
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

  const statusSteps = [
    { key: 'Recebido', label: 'Pedido Recebido', description: 'Seu pedido foi recebido pelo estabelecimento.', completed: true },
    { key: 'Em Preparação', label: 'Pedido em Preparação', description: 'Seu pedido está sendo preparado.', completed: orderStatus === 'Em Preparação' || orderStatus === 'Em entrega' || orderStatus === 'Entregue' || orderStatus === 'Expedido' },
    { key: 'Em entrega', label: 'Saiu para Entrega', description: 'Seu pedido está a caminho.', completed: orderStatus === 'Em entrega' || orderStatus === 'Entregue' },
    { key: 'Entregue', label: 'Pedido Entregue', description: 'Seu pedido foi entregue com sucesso.', completed: orderStatus === 'Entregue' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Moon className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>
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
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <img
                  src={orderIcon}
                  alt="Ícone do pedido"
                  className="h-8 w-auto mr-3 text-4xl" 
                />
                <strong>Pedido #{pedido.data.id}</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <img
                  src={deliveryIcon}
                  alt="Ícone do delivery"
                  className="h-8 w-auto mr-3 text-4xl" 
                />
                <strong>{pedido.data.forma_entrega}</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <img
                  src={payIcon}
                  alt="Ícone do pagamento"
                  className="h-8 w-auto mr-3 text-4xl" 
                />
                <strong>Pagamento:&nbsp; </strong> {pedido.data.forma_pagamento}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <img
                  src={userIcon}
                  alt="Ícone do pagamento"
                  className="h-8 w-auto mr-3 text-4xl" 
                />
                <strong>Cliente:&nbsp;</strong> {pedido.data.cliente?.nome || 'Cliente'}
              </p>
            </div>
          </div>

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