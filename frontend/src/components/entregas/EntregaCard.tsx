import React, { useState } from 'react';
import ModalDesignarEntregador from './ModalDesignarEntregador';

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
    };
    endereco: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  };
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

interface EntregaCardProps {
  entrega: Entrega;
  onDesignarEntregador?: (entregadorId: number) => void;
  onMarcarComoEntregue?: () => void;
}

const EntregaCard: React.FC<EntregaCardProps> = ({
  entrega,
  onDesignarEntregador,
  onMarcarComoEntregue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImprimirComanda = () => {
    const comanda = `
      Comanda do Pedido #${entrega.pedido_id}
      Cliente: ${entrega.pedido.cliente.nome} (${entrega.pedido.cliente.telefone})
      Endereço: ${entrega.pedido.endereco.rua}, ${entrega.pedido.endereco.numero} - ${entrega.pedido.endereco.bairro}, ${entrega.pedido.endereco.cidade}/${entrega.pedido.endereco.estado} - ${entrega.pedido.endereco.cep}
      Forma de Pagamento: ${entrega.pedido.forma_pagamento}
      Observações: ${entrega.pedido.observacoes || 'Nenhuma'}
    `;
    console.log(comanda); // Substitua por lógica de impressão real
    alert('Comanda impressa no console!');
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Pedido #{entrega.pedido_id}
      </p>

      {/* Informações do Entregador */}
      {entrega.entregador && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Entregador: {entrega.entregador.nome} ({entrega.entregador.veiculo})
        </p>
      )}

      {/* Botões de Ação */}
      <div className="mt-4">
        {onDesignarEntregador && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Designar Entregador
          </button>
        )}

        {onMarcarComoEntregue && (
          <button
            onClick={onMarcarComoEntregue}
            className="w-full bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors mt-2"
          >
            Marcar como Entregue
          </button>
        )}

        {/* Botão para Imprimir Comanda */}
        <button
          onClick={handleImprimirComanda}
          className="w-full bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition-colors mt-2"
        >
          Imprimir Comanda
        </button>
      </div>

      {/* Modal para Designar Entregador */}
      {onDesignarEntregador && (
        <ModalDesignarEntregador
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDesignar={onDesignarEntregador}
        />
      )}
    </div>
  );
};

export default EntregaCard;