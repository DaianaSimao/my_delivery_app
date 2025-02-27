import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import EntregaColumn from './EntregaColumn';
import useEntregas from '../../hooks/useEntregas';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Entrega {
  pedido: any;
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

  const [searchTerm, setSearchTerm] = useState('');

  const filterEntregas = (entregas: Entrega[], term: string) => {
    return entregas.filter((entrega) =>
      entrega.pedido.cliente?.nome.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Atualiza o estado `data` quando as entregas são carregadas
  useEffect(() => {
    if (entregas.length > 0) {
      const filteredData = {
        Aguardando: filterEntregas(entregas.filter((e) => e.status === 'Aguardando'), searchTerm),
        SaiuParaEntrega: filterEntregas(entregas.filter((e) => e.status === 'Em entrega'), searchTerm),
        Entregue: filterEntregas(entregas.filter((e) => e.status === 'Entregue'), searchTerm),
      }; 
      setData(filteredData);
    }
  }, [entregas, searchTerm]);

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

  const handleStatusChange = async (entregaId: number, newStatus: string) => {
    try {
      const formattedStatus = newStatus.replace(/ /g, '_');

      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { status: formattedStatus },
      });

      if (response.status !== 200) {
        throw new Error('Erro ao atualizar o status da entrega');
      }

      setData((prevData) => {
        const updatedData = { ...prevData };

        Object.keys(updatedData).forEach((status) => {
          updatedData[status] = updatedData[status].filter((e) => e.id !== entregaId);
        });

        updatedData[formattedStatus].push(response.data);

        return updatedData;
      });

      toast.success('Status da entrega atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status da entrega:', error);
      toast.error('Erro ao atualizar o status da entrega.');
    }
  }
    

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <div className="p-4"></div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700 mt-10">
        <div className="w-full md:w-1/2">
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault(); // Evita o recarregamento da página
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
      </div>
        <DragDropContext onDragEnd={() => {}}>
          <div className="flex space-x-4 p-4 mt-10">
            <EntregaColumn
              columnId="Aguardando"
              title="Aguardando Entrega"
              entregas={data.Aguardando}
              onDesignarEntregador={handleDesignarEntregador}
              onStatusChange={handleStatusChange}
            />
            <EntregaColumn
              columnId="SaiuParaEntrega"
              title="Saiu para Entrega"
              entregas={data.SaiuParaEntrega}
              onMarcarComoEntregue={handleMarcarComoEntregue}
              onStatusChange={handleStatusChange}
            />
            <EntregaColumn
              columnId="Entregue"
              title="Entregue"
              entregas={data.Entregue}
            />
          </div>
        </DragDropContext>
    </>
  );
};

export default EntregasList;