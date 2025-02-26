import React from 'react';

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

interface PedidoModalProps {
  pedido: Pedido;
  onClose: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Detalhes do Pedido #{pedido.id}
        </h2>

        {/* Informações do Cliente */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cliente</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nome: {pedido.cliente?.nome || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Telefone: {pedido.cliente?.telefone || 'N/A'}
          </p>
        </div>

        {/* Endereço de Entrega */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Endereço de Entrega</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pedido.endereco?.rua}, {pedido.endereco?.numero}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pedido.endereco?.bairro}, {pedido.endereco?.cidade} - {pedido.endereco?.estado}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">CEP: {pedido.endereco?.cep}</p>
        </div>

        {/* Itens do Pedido */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Itens do Pedido</h3>
          <ul className="list-disc list-inside">
            {pedido.itens_pedidos.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {item.quantidade}x {item.produto.nome}

                {/* Acompanhamentos */}
                {item.produto.acompanhamentos && item.produto.acompanhamentos.length > 0 && (
                  <ul className="ml-4 list-disc list-inside">
                    {item.produto.acompanhamentos.map((acompanhamento, aIndex) => (
                      <li key={aIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        {acompanhamento.nome} (Quantidade máxima: {acompanhamento.quantidade_maxima})

                        {/* Itens dos Acompanhamentos */}
                        {acompanhamento.item_acompanhamentos && acompanhamento.item_acompanhamentos.length > 0 && (
                          <ul className="ml-4 list-disc list-inside">
                            {acompanhamento.item_acompanhamentos.map((itemAcompanhamento, iaIndex) => (
                              <li key={iaIndex} className="text-sm text-gray-600 dark:text-gray-400">
                                {itemAcompanhamento.nome} - R$ {itemAcompanhamento.preco}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Informações de Pagamento */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pagamento</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Método: {pedido.pagamento?.metodo || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: {pedido.pagamento?.status || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Valor: R$ {pedido.pagamento?.valor || 'N/A'}
          </p>
        </div>

        {/* Botão para Fechar o Modal */}
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PedidoModal;