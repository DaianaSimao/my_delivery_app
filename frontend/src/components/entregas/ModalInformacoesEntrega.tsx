import React from 'react';

interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  pedido: {
    id: number;
    forma_pagamento: string;
    observacoes: string;
    cliente: {
      nome: string;
      telefone: string;
      endereco: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
      };
    };
  };
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

interface ModalInformacoesEntregaProps {
  isOpen: boolean;
  onClose: () => void;
  entrega: Entrega;
}

const ModalInformacoesEntrega: React.FC<ModalInformacoesEntregaProps> = ({
  isOpen,
  onClose,
  entrega,
}) => {
  if (!isOpen) return null;
  console.log(entrega.pedido.cliente.endereco);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Informações da Entrega
        </h2>

        {/* Detalhes da Entrega */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pedido #{entrega.pedido_id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: {entrega.status}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cliente: {entrega.pedido.cliente.nome} ({entrega.pedido.cliente.telefone})
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Endereço: {entrega.pedido.cliente.endereco.rua}, {entrega.pedido.cliente.endereco.numero} - {entrega.pedido.cliente.endereco.bairro}, {entrega.pedido.cliente.endereco.cidade}/{entrega.pedido.cliente.endereco.estado} - {entrega.pedido.cliente.endereco.cep}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Forma de Pagamento: {entrega.pedido.forma_pagamento}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Observações: {entrega.pedido.observacoes || 'Nenhuma'}
          </p>
          {entrega.entregador && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Entregador: {entrega.entregador.nome} ({entrega.entregador.veiculo})
            </p>
          )}
        </div>

        {/* Botão para Fechar o Modal */}
        <button
          onClick={onClose} // Chama a função onClose diretamente
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mt-4"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalInformacoesEntrega;