import React, { useState } from 'react';

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
  created_at: string;
  forma_pagamento: string;
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

  const statusOptions = ['Recebido', 'Em Análise', 'Em Preparação', 'Expedido'];

  // Formata a data do pedido
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 mb-4 rounded-lg shadow-md border-l-4 bg-white dark:bg-gray-800 relative">
      {/* Dropdown de Ações */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
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
                        onClick={() => onStatusChange(pedido.id, status)}
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
                onClick={() => onCancel(pedido.id)}
                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>

              {/* Editar */}
              <button
                onClick={() => onEdit(pedido.id)}
                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Editar
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

      {/* Botão para Baixar Fatura */}
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
        📝 Baixar Comanda
      </button>

      {/* Detalhes do Pedido */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Itens:</p>
        <ul className="list-disc list-inside">
          {pedido.itens_pedidos.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
              {item.quantidade}x {item.produto.nome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PedidosCard;