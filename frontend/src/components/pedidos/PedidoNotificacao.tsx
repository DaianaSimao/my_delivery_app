import React, { useEffect, useState } from 'react';
import { createConsumer, Subscription } from '@rails/actioncable';
import { Howl } from 'howler';
import PedidoModal from './PedidoModal';

interface Pedido {
  id: number;
  status: string;
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
  };
  valor_total: number;
  itens_pedidos: Array<{
    produto: {
      nome: string;
      acompanhamentos?: Array<{
        id: number;
        nome: string;
        quantidade_maxima: number;
        item_acompanhamentos?: Array<{
          id: number;
          nome: string;
          preco: number;
        }>;
      }>;
    };
    quantidade: number;
  }>;
  created_at: string;
  forma_pagamento: string;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  pagamento?: {
    metodo: string;
    status: string;
    valor: string;
  };
}

// Configuração do som de notificação
const notificationSound = new Howl({
  src: ['/sounds/notification-sound.mp3', '/sounds/notification-sound.ogg'], // Carrega múltiplos formatos
  preload: true,
  html5: true,
});

const PedidoNotificacao: React.FC = () => {
  const [notifications, setNotifications] = useState<Pedido[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a visibilidade do modal
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null); // Armazena o pedido selecionado

  // Função para tocar o som
  const playNotificationSound = () => {
    console.log('Tentando tocar o som...');

    // Verifica se o som está carregado
    if (notificationSound.state() === 'loaded') {
      console.log('Som carregado com sucesso.');
      notificationSound.play();
    } else {
      console.error('Som não está carregado.');
    }

    // Listeners para eventos do Howler.js
    notificationSound.on('play', () => {
      console.log("Som tocado com sucesso");
    });

    notificationSound.on('loaderror', (id, error) => {
      console.error("Erro ao carregar o som:", error);
    });

    notificationSound.on('playerror', (id, error) => {
      console.error("Erro ao tentar tocar o som:", error);
    });
  };

  // Função para exibir notificação do navegador
  const showNotification = async () => {
    if (Notification.permission === "granted") {
      new Notification("Novo Pedido!", {
        body: "Você recebeu um novo pedido!",
        icon: "/path/to/icon.png",
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Novo Pedido!", {
          body: "Você recebeu um novo pedido!",
          icon: "/path/to/icon.png",
        });
      } else {
        console.log("Permissão de notificação negada pelo usuário.");
      }
    } else {
      console.log("Permissão de notificação negada anteriormente.");
    }
  };

  // Função para remover uma notificação
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((pedido) => pedido.id !== id));
  };

  // Função para abrir o modal
  const openModal = (pedido: Pedido) => {
    setSelectedPedido(pedido); // Define o pedido selecionado
    setIsModalOpen(true); // Abre o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setSelectedPedido(null); // Limpa o pedido selecionado
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const restauranteId = localStorage.getItem('restauranteId');
    console.log("Restaurante ID:", restauranteId);

    if (!restauranteId || restauranteId === 'undefined') {
      console.error("Restaurante ID inválido:", restauranteId);
      return;
    }

    if (!token || !restauranteId) {
      console.error('Token ou restauranteId não encontrados no localStorage');
      return;
    }

    const consumer = createConsumer(`ws://localhost:3000/cable?token=${token}`);

    const subscription: Subscription = consumer.subscriptions.create(
      { channel: 'PedidoNotificacaoChannel', restaurante_id: restauranteId },
      {
        received: (data: { type: string; pedido: Pedido }) => {
          console.log("Recebido:", JSON.stringify(data, null, 2));
          if (data.type === 'new_order') {
            setNotifications((prev) => {
              // Verifica se o pedido já existe no estado
              const pedidoExistente = prev.find((p) => p.id === data.pedido.id);
              if (!pedidoExistente) {
                return [...prev, data.pedido]; // Adiciona o pedido apenas se não existir
              }
              return prev; // Retorna o estado anterior se o pedido já existir
            });
            showNotification();
            playNotificationSound();
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
<div className="fixed top-0 right-0 p-4 z-50">
  {notifications.map((pedido) => (
    <div
      key={pedido.id}
      className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 w-96 mt-16"
      onClick={() => openModal(pedido)}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="shrink-0 w-6 h-6 me-2" // Ícone maior
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <h3 className="text-lg font-medium">Novo Pedido Recebido</h3> {/* Título maior */}
        </div>
        <button
          type="button"
          className="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:hover:bg-green-600 dark:border-green-600 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800"
          onClick={(e) => {
            e.stopPropagation(); // Evita que o clique no botão abra o modal
            removeNotification(pedido.id);
          }}
        >
          Fechar
        </button>
      </div>
      <div className="mt-2 text-base"> {/* Texto maior */}
        Pedido ID: {pedido.id} - {pedido.cliente?.nome}
      </div>
    </div>
  ))}
  {/* Renderiza o modal se estiver aberto */}
  {isModalOpen && selectedPedido && (
    <PedidoModal pedido={selectedPedido} onClose={closeModal} />
  )}
</div>
  );
};

export default PedidoNotificacao;