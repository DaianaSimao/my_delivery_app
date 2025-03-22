import React, { useState } from 'react';
import PedidoModal from './PedidoModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { gerarComandaPDF } from '../../utils/comandaCozinhaGenerator'; // Importe a função utilitária

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
      id: number;
      nome: string;
      preco: number;
    };
    acompanhamentos_pedidos?: Array<{
      id: number;
      item_acompanhamento: {
        id: number;
        nome: string;
        preco: number;
        acompanhamento: {
          id: number;
          nome: string;
        };
      };
      quantidade: number;
    }>;
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
  pagamento: {
    id: number;
    metodo: string;
    status: string;
    valor: string;
  };
  observacoes?: string;
}

interface PedidosCardProps {
  pedido: Pedido;
  onStatusChange: (pedidoId: number, newStatus: string) => void;
  onCancel: (pedidoId: number) => void;
  onEdit: (pedidoId: number) => void;
}

const PedidosCard: React.FC<PedidosCardProps> = ({ pedido, onStatusChange, onCancel, onEdit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const statusOptions = ['Recebido', 'Em Análise', 'Em Preparação', 'Expedido'];

  // Verifica se o pedido está definido
  if (!pedido) {
    return <p className="text-red-500">Erro: Pedido não encontrado.</p>;
  }

  // Formata a data do pedido
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleEditCliente = () => {
    if (pedido.cliente) {
      navigate(`/clientes/${pedido.cliente.id}/editar`);
    }
  };

  // Função para baixar a comanda em PDF
  const handleDownloadComanda = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão abra o modal
    gerarComandaPDF(pedido); // Usa a função utilitária
  };

  return (
    <>
      {/* Card do Pedido */}
      <div
        className="p-4 mb-4 rounded-lg shadow-md border-l-4 bg-white dark:bg-gray-800 relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Dropdown de Ações */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="py-1">
                {/* Mudar Status */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    }}
                    className="flex justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Mudar Status
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(pedido.id, status);
                          }}
                          className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cancelar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(pedido.id);
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCliente();
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Editar Cliente
                </button>
                <button
                  onClick={() => navigate(`/pedidos/${pedido.id}/editar-itens`)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Editar Itens
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pedido.pagamento) {
                      navigate(`/pedidos/${pedido.id}/editar-pagamento`);
                    } else {
                      toast.error("Pagamento não encontrado para este pedido.");
                    }
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Editar Pagamento
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo do Card */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pedido #{pedido.id} - {pedido.status}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Data do Pedido: {formatDate(pedido.created_at)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Método de Pagamento: {pedido.forma_pagamento}
          </p>
        </div>

        {/* Botão para Baixar Comanda */}
        <button
          onClick={handleDownloadComanda}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          📝 Baixar Comanda
        </button>

        {/* Detalhes do Pedido */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Itens:</p>
          {pedido.itens_pedidos && pedido.itens_pedidos.length > 0 ? (
            <ul className="list-disc list-inside">
              {pedido.itens_pedidos.map((item, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {item.quantidade}x {item.produto.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum item encontrado.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PedidoModal pedido={pedido} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default PedidosCard;