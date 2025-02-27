import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import EntregaColumn from './EntregaColumn';
import useEntregas from '../../hooks/useEntregas';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  entregador_id?: number;
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

const EntregasList: React.FC = () => {
  const { entregas, loading, error } = useEntregas();
  const [data, setData] = useState({
    Aguardando: [] as Entrega[],
    SaiuParaEntrega: [] as Entrega[],
    Entregue: [] as Entrega[],
  });

  // Atualiza o estado `data` quando as entregas são carregadas
  useEffect(() => {
    if (entregas.length > 0) {
      const filteredData = {
        Aguardando: entregas.filter((e) => e.status === 'Aguardando'),
        SaiuParaEntrega: entregas.filter((e) => e.status === 'Em entrega'),
        Entregue: entregas.filter((e) => e.status === 'Entregue'),
      };
      console.log('Dados filtrados:', filteredData); // Verifique os dados filtrados aqui
      setData(filteredData);
    }
  }, [entregas]);

  // Função para designar um entregador
  const handleDesignarEntregador = async (entregaId: number, entregadorId: number) => {
    try {
      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { entregador_id: entregadorId, status: 'Em entrega' },
      });

      if (response.status !== 200) {
        throw new Error('Erro ao designar entregador');
      }

      // Atualiza o estado local
      setData((prevData) => {
        const updatedData = { ...prevData };

        // Remove a entrega da coluna "Aguardando"
        updatedData.Aguardando = updatedData.Aguardando.filter((e) => e.id !== entregaId);

        // Adiciona a entrega na coluna "SaiuParaEntrega"
        updatedData.SaiuParaEntrega.push(response.data);

        return updatedData;
      });

      toast.success('Entregador designado com sucesso!');
    } catch (error) {
      console.error('Erro ao designar entregador:', error);
      toast.error('Erro ao designar entregador.');
    }
  };

  // Função para marcar como entregue
  const handleMarcarComoEntregue = async (entregaId: number) => {
    try {
      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { status: 'Entregue' },
      });

      if (response.status !== 200) {
        throw new Error('Erro ao marcar como entregue');
      }

      // Atualiza o estado local
      setData((prevData) => {
        const updatedData = { ...prevData };

        // Remove a entrega da coluna "SaiuParaEntrega"
        updatedData.SaiuParaEntrega = updatedData.SaiuParaEntrega.filter((e) => e.id !== entregaId);

        // Adiciona a entrega na coluna "Entregue"
        updatedData.Entregue.push(response.data);

        return updatedData;
      });

      toast.success('Pedido marcado como entregue!');
    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
      toast.error('Erro ao marcar como entregue.');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex space-x-4 p-4 mt-10">
        <EntregaColumn
          columnId="Aguardando"
          title="Aguardando Entrega"
          entregas={data.Aguardando}
          onDesignarEntregador={handleDesignarEntregador}
        />
        <EntregaColumn
          columnId="SaiuParaEntrega"
          title="Saiu para Entrega"
          entregas={data.SaiuParaEntrega}
          onMarcarComoEntregue={handleMarcarComoEntregue}
        />
        <EntregaColumn
          columnId="Entregue"
          title="Entregue"
          entregas={data.Entregue}
        />
      </div>
    </DragDropContext>
  );
};

export default EntregasList;