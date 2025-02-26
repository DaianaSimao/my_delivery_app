import React from 'react';

interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

interface EntregaCardProps {
  entrega: Entrega;
  onDesignarEntregador?: () => void;
  onMarcarComoEntregue?: () => void;
}

const EntregaCard: React.FC<EntregaCardProps> = ({
  entrega,
  onDesignarEntregador,
  onMarcarComoEntregue,
}) => {
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
            onClick={onDesignarEntregador}
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
      </div>
    </div>
  );
};

export default EntregaCard;