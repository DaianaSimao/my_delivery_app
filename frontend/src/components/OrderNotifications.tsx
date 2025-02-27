import React, { useEffect, useState } from 'react';
import { createConsumer, Subscription } from '@rails/actioncable';
import { Howl } from 'howler';

interface Pedido {
  id: number;
  status: string;
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
  };
  valor_total: number;
  itens_pedidos?: Array<{
    produto: {
      nome: string;
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

const OrderNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Pedido[]>([]);

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
      { channel: 'OrderNotificationsChannel', restaurante_id: restauranteId },
      {
        received: (data: { type: string; pedido: Pedido }) => {
          console.log("Recebido:", JSON.stringify(data, null, 2));
          if (data.type === 'new_order') {
            setNotifications((prev) => [...prev, data.pedido]);
            showNotification();
            playNotificationSound();
          }
        },
      }
    );
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      {notifications.map((pedido) => (
        <div key={`${pedido.id}-${pedido.created_at}`} className="bg-white p-4 rounded-lg shadow-lg mb-2">
          <p>Novo pedido recebido: #{pedido.id}</p>
          <p>Cliente: {pedido.cliente?.nome}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderNotifications;