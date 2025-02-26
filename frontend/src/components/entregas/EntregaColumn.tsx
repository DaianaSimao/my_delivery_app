import React from 'react';
import EntregaCard from './EntregaCard';

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

interface EntregaColumnProps {
  columnId: string;
  title: string;
  entregas: Entrega[];
  onDesignarEntregador?: (entregaId: number) => void;
  onMarcarComoEntregue?: (entregaId: number) => void;
}

const EntregaColumn: React.FC<EntregaColumnProps> = ({
  columnId,
  title,
  entregas,
  onDesignarEntregador,
  onMarcarComoEntregue,
}) => {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ul className="space-y-4">
        {entregas.map((entrega) => (
          <li key={entrega.id}>
            <EntregaCard
              entrega={entrega}
              onDesignarEntregador={
                columnId === 'Aguardando' && onDesignarEntregador
                  ? () => onDesignarEntregador(entrega.id)
                  : undefined
              }
              onMarcarComoEntregue={
                columnId === 'SaiuParaEntrega' && onMarcarComoEntregue
                  ? () => onMarcarComoEntregue(entrega.id)
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntregaColumn;