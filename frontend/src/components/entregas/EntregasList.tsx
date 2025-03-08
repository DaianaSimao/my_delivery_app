import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { EntregaColumn } from './EntregaColumn';
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
  const [pedidoId, setPedidoId] = useState('');
  const [entregadorNome, setEntregadorNome] = useState('');

  const filterEntregas = (entregas: Entrega[], term: string) => {
    return entregas.filter((entrega) =>
      entrega.pedido.cliente?.nome.toLowerCase().includes(term.toLowerCase())
    );
  };

  useEffect(() => {
    if (entregas.length > 0) {
      const filteredData = {
        Aguardando: filterEntregas(entregas.filter((e: Entrega) => e.status === 'Aguardando'), searchTerm),
        SaiuParaEntrega: filterEntregas(entregas.filter((e: Entrega) => e.status === 'Em entrega'), searchTerm),
        Entregue: filterEntregas(entregas.filter((e: Entrega) => e.status === 'Entregue'), searchTerm),
      };
      setData(filteredData);
    }
  }, [entregas, searchTerm]);

  const buscarEntregas = async () => {
    try {
      const response = await api.get('/api/v1/entregas', {
        params: {
          search: searchTerm,
          pedido_id: pedidoId,
          entregador_nome: entregadorNome,
        },
      });

      if (response.status !== 200) {
        throw new Error('Erro ao buscar entregas');
      }

      setData({
        Aguardando: response.data.filter((e: Entrega) => e.status === 'Aguardando'),
        SaiuParaEntrega: response.data.filter((e: Entrega) => e.status === 'Em entrega'),
        Entregue: response.data.filter((e: Entrega) => e.status === 'Entregue'),
      });
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      toast.error('Erro ao buscar entregas.');
    }
  };

  useEffect(() => {
    buscarEntregas();
  }, [searchTerm, pedidoId, entregadorNome]);

  const handleDesignarEntregador = async (entregaId: number, selectedEntregador: number) => {
    console.log('Designar entregador:', entregaId, selectedEntregador);
    try {
      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { entregador_id: selectedEntregador, status: 'Em entrega' },
      });

      if (response.status !== 200) {
        throw new Error('Erro ao designar entregador');
      }

      setData((prevData) => {
        const updatedData = { ...prevData };

        updatedData.Aguardando = updatedData.Aguardando.filter((e) => e.id !== entregaId);

        updatedData.SaiuParaEntrega.unshift(response.data);

        return updatedData;
      });

      toast.success('Entregador designado com sucesso!');
    } catch (error) {
      console.error('Erro ao designar entregador:', error);
      toast.error('Erro ao designar entregador.');
    }
  };

  const handleMarcarComoEntregue = async (entregaId: number) => {
    try {
      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { status: 'Entregue' },
      });
  
      if (response.status !== 200) {
        throw new Error('Erro ao marcar como entregue');
      }
  
      setData((prevData) => {
        const updatedData = {
          Aguardando: prevData.Aguardando.filter((e) => e.id !== entregaId),
          SaiuParaEntrega: prevData.SaiuParaEntrega.filter((e) => e.id !== entregaId),
          Entregue: prevData.Entregue.some((e) => e.id === entregaId)
            ? prevData.Entregue
            : [response.data, ...prevData.Entregue],
        };
  
        return updatedData;
      });
  
      toast.success('Pedido marcado como entregue!');
    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
      toast.error('Erro ao marcar como entregue.');
    }
  };
  

  const handleStatusChange = async (entregaId: number, newStatus: string) => {
    console.log('Mudar status:', entregaId, newStatus);
    try {
      const response = await api.put(`/api/v1/entregas/${entregaId}`, {
        entrega: { status: newStatus }, // Mantendo exatamente o status recebido
      });
  
      if (response.status !== 200) {
        throw new Error('Erro ao atualizar o status da entrega');
      }
  
      setData((prevData) => {
        const updatedData: typeof prevData = { ...prevData };
  
        // Removendo a entrega de todas as colunas antes de adicionar na nova
        (Object.keys(updatedData) as (keyof typeof updatedData)[]).forEach((status) => {
          updatedData[status] = updatedData[status].filter((e) => e.id !== entregaId);
        });
  
        // Garantindo que o status seja tratado corretamente
        if (newStatus === "Em entrega") {
          updatedData["SaiuParaEntrega"] = [response.data, ...updatedData["SaiuParaEntrega"]];
        } else {
          updatedData[newStatus as keyof typeof updatedData] = [
            response.data,
            ...updatedData[newStatus as keyof typeof updatedData],
          ];
        }
  
        return updatedData;
      });
  
      toast.success('Status da entrega atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status da entrega:', error);
      toast.error('Erro ao atualizar o status da entrega.');
    }
  };
  

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
        <div className="w-full md:w-1/4">
          <input
            type="text"
            placeholder="ID do Pedido"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
        <div className="w-full md:w-1/4">
          <input
            type="text"
            placeholder="Nome do Entregador"
            value={entregadorNome}
            onChange={(e) => setEntregadorNome(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          />
        </div>
      </div>
      <DragDropContext onDragEnd={() => {}}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 mt-10">
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
            onStatusChange={handleStatusChange}
          />
        </div>
      </DragDropContext>
    </>
  );
};

export default EntregasList;