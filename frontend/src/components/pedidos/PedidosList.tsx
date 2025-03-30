import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import PedidoColumn from './PedidoColumn';
import usePedidos from '../../hooks/usePedidos';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { createConsumer } from '@rails/actioncable';
import { Pedido } from '../../types/Pedido';

const PedidosList: React.FC = () => {
  const { pedidos, loading, error } = usePedidos();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPedidoId, setSearchPedidoId] = useState('');
  const [data, setData] = useState({
    Recebido: [] as Pedido[],
    Em_Análise: [] as Pedido[],
    Em_Preparação: [] as Pedido[],
    Expedido: [] as Pedido[],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const restauranteId = localStorage.getItem('restauranteId');

    if (!token || !restauranteId) {
      console.error('Token ou restauranteId não encontrados no localStorage');
      return;
    }

    const cable = createConsumer(`ws://localhost:3000/cable?token=${token}`);

    const subscription = cable.subscriptions.create(
      { channel: 'PedidosChannel', restaurante_id: restauranteId },
      {
        received: (message: { type: string; pedido: Pedido }) => {
          console.log('Mensagem recebida:', message);
          if (message.type === 'NEW_PEDIDO') {
            setData((prevData) => ({
              ...prevData,
              Recebido: [message.pedido, ...prevData.Recebido],
            }));
            toast.success(`Novo pedido recebido: #${message.pedido.id}`);
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filterPedidos = (pedidos: Pedido[], term: string, pedidoId: string) => {
    return pedidos.filter((pedido) => {
      const matchesNome = pedido.cliente?.nome.toLowerCase().includes(term.toLowerCase());
      const matchesId = pedidoId ? pedido.id.toString() === pedidoId : true;
      return matchesNome && matchesId;
    });
  };

  useEffect(() => {
    if (pedidos.length > 0) {
      const filteredPedidos = {
        Recebido: filterPedidos(pedidos.filter((p) => p.status === 'Recebido'), searchTerm, searchPedidoId),
        Em_Análise: filterPedidos(pedidos.filter((p) => p.status === 'Em Análise'), searchTerm, searchPedidoId),
        Em_Preparação: filterPedidos(pedidos.filter((p) => p.status === 'Em Preparação'), searchTerm, searchPedidoId),
        Expedido: filterPedidos(pedidos.filter((p) => p.status === 'Expedido'), searchTerm, searchPedidoId),
      };
      setData(filteredPedidos);
    }
  }, [pedidos, searchTerm, searchPedidoId]);

  const handleStatusChange = async (pedidoId: number, newStatus: string) => {
    try {
      const response = await api.put(`/api/v1/pedidos/${pedidoId}`, {
        status: newStatus,
      });

      if (response.status !== 200) {
        throw new Error('Erro ao atualizar o status do pedido');
      }

      setData((prevData) => {
        const updatedData = { ...prevData };

        const pedidoAtual = Object.values(prevData)
          .flat()
          .find(p => p.id === pedidoId);

        Object.keys(updatedData).forEach((status) => {
          updatedData[status as keyof typeof updatedData] = updatedData[status as keyof typeof updatedData].filter((pedido) => pedido.id !== pedidoId);
        });

        const pedidoAtualizado = {
          ...response.data.data,
          cliente: pedidoAtual?.cliente || response.data.data.cliente
        };

        if (newStatus === 'Recebido') {
          updatedData.Recebido.unshift(pedidoAtualizado);
        } else if (newStatus === 'Em Análise') {
          updatedData.Em_Análise.unshift(pedidoAtualizado);
        } else if (newStatus === 'Em Preparação') {
          updatedData.Em_Preparação.unshift(pedidoAtualizado);
        } else if (newStatus === 'Expedido') {
          updatedData.Expedido.unshift(pedidoAtualizado);
        } else {
          console.error(`Status "${newStatus}" não existe no estado.`);
        }

        return updatedData;
      });

      toast.success('Status do pedido atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status do pedido:', error);
      toast.error('Erro ao atualizar o status do pedido.');
    }
  };

  const handleCancel = async (pedidoId: number) => {
    const confirmCancel = await toast.promise(
      new Promise((resolve) => {
        toast(
          (t) => (
            <div>
              <p>Tem certeza que deseja cancelar o pedido?</p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Sim
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Não
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
          }
        );
      }),
      {
        loading: 'Cancelando pedido...',
        success: 'Pedido cancelado com sucesso!',
        error: 'Erro ao cancelar o pedido.',
      }
    );

    if (!confirmCancel) return;

    try {
      const response = await api.put(`/api/v1/pedidos/${pedidoId}`, {
        status: "Cancelado",
      });
      if (response.status !== 200) {
        throw new Error('Erro ao cancelar o pedido');
      }

      setData((prevData) => {
        const updatedData = { ...prevData };
        (Object.keys(updatedData) as Array<keyof typeof updatedData>).forEach((status) => {
          updatedData[status] = updatedData[status].filter((pedido) => pedido.id !== pedidoId);
        });
        return updatedData;
      });

    } catch (error) {
      console.error('Erro ao cancelar o pedido:', error);
      toast.error('Erro ao cancelar o pedido.');
    }
  };

  const handleEdit = (pedidoId: number) => {
    console.log(`Editar pedido ${pedidoId}`);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700 mt-10">
        <div className="w-full md:w-1/2">
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="simple-search" className="sr-only">
              Buscar
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                placeholder="Buscar por nome do cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
          </form>
        </div>
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="ID do Pedido"
            value={searchPedidoId}
            onChange={(e) => setSearchPedidoId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/entregas')}
            className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Ver Entregas
          </button>
          <button
            onClick={() => navigate('/pedidos/listar_pedidos')}
            className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            Pedidos Internos
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={() => {}}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4">
          <PedidoColumn
            columnId="Recebido"
            title="Recebido"
            pedidos={data.Recebido}
            onStatusChange={handleStatusChange}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
          <PedidoColumn
            columnId="Em_Análise"
            title="Em Análise"
            pedidos={data.Em_Análise}
            onStatusChange={handleStatusChange}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
          <PedidoColumn
            columnId="Em_Preparação"
            title="Em Preparação"
            pedidos={data.Em_Preparação}
            onStatusChange={handleStatusChange}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
          <PedidoColumn
            columnId="Expedido"
            title="Expedido"
            pedidos={data.Expedido}
            onStatusChange={handleStatusChange}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default PedidosList;