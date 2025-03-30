// src/components/pedidos/PedidoColumn.tsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PedidosCard from './PedidosCard';

interface PedidoColumnProps {
  columnId: string;
  title: string;
  pedidos?: Array<any>;
  onStatusChange: (pedidoId: number, newStatus: string) => void;
  onCancel: (pedidoId: number) => void;
  onEdit: (pedidoId: number) => void;
}

const PedidoColumn: React.FC<PedidoColumnProps> = ({
  columnId,
  title,
  pedidos = [],
  onStatusChange,
  onCancel,
  onEdit,
}) => {
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'Recebido':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'Em Análise':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'Em Preparação':
        return 'bg-orange-100 dark:bg-orange-900';
      case 'Expedido':
        return 'bg-green-100 dark:bg-green-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  };
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 p-4 rounded-lg ${getColumnColor(title)}`}
        >
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
          {pedidos.map((pedido, index) => (
            <PedidosCard
              key={`${pedido.id}-${index}`}
              pedido={pedido}
              onStatusChange={onStatusChange}
              onCancel={onCancel}
              onEdit={onEdit}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default PedidoColumn;