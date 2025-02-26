import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PedidoColumn from './PedidoColumn';
import usePedidos from '../../hooks/usePedidos';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
    };
    quantidade: number;
  }>;
}

const PedidosList: React.FC = () => {
  const { pedidos, loading, error } = usePedidos();
  const [data, setData] = useState({
    Recebido: [] as Pedido[],
    Em_Análise: [] as Pedido[],
    Em_Preparação: [] as Pedido[],
    Expedido: [] as Pedido[],
  });

  // Atualiza o estado `data` quando os pedidos são carregados
  useEffect(() => {
    if (pedidos.length > 0) {
      setData({
        Recebido: pedidos.filter((p) => p.status === 'Recebido'),
        Em_Análise: pedidos.filter((p) => p.status === 'Em_Análise'),
        Em_Preparação: pedidos.filter((p) => p.status === 'Em_Preparação'),
        Expedido: pedidos.filter((p) => p.status === 'Expedido'),
      });
    }
  }, [pedidos]);

  // Função para mudar o status do pedido
  const handleStatusChange = async (pedidoId: number, newStatus: string) => {
    try {
      const formattedStatus = newStatus.replace(/ /g, '_');
  
      // Envia a requisição para atualizar o status no backend
      const response = await api.put(`/api/v1/pedidos/${pedidoId}`, {
        pedido: { status: formattedStatus },
      });
  
      if (response.status !== 200) {
        throw new Error('Erro ao atualizar o status do pedido');
      }
  
      // A resposta já é um objeto JavaScript, não é necessário fazer JSON.parse
      const responseData = response.data;
  
      // Atualiza o estado local (frontend) com o novo status
      setData((prevData) => {
        const updatedData = { ...prevData };
  
        // Remove o pedido da coluna atual
        Object.keys(updatedData).forEach((status) => {
          updatedData[status] = updatedData[status].filter((pedido) => pedido.id !== pedidoId);
        });
  
        // Adiciona o pedido na nova coluna
        updatedData[formattedStatus].push(responseData.data);
  
        return updatedData;
      });
  
      toast.success('Status do pedido atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status do pedido:', error);
      toast.error('Erro ao atualizar o status do pedido.');
    }
  };

  // Função para cancelar o pedido
  const handleCancel = async (pedidoId: number) => {
    try {
      const response = await api.delete(`/api/v1/pedidos/${pedidoId}`);

      if (response.status !== 200) {
        throw new Error('Erro ao cancelar o pedido');
      }

      // Remove o pedido do estado local
      setData((prevData) => {
        const updatedData = { ...prevData };
        Object.keys(updatedData).forEach((status) => {
          updatedData[status] = updatedData[status].filter((pedido) => pedido.id !== pedidoId);
        });
        return updatedData;
      });
      console.log('Dados atualizados:', updatedData);
      toast.success('Pedido cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar o pedido:', error);
      toast.error('Erro ao cancelar o pedido.');
    }
  };

  // Função para editar o pedido
  const handleEdit = (pedidoId: number) => {
    console.log(`Editar pedido ${pedidoId}`);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex space-x-4 p-4 mt-10">
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
  );
};

export default PedidosList;