import React from 'react';
import EntregaCard from './EntregaCard';

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

interface EntregaColumnProps {
  columnId: string;
  title: string;
  entregas: Entrega[];
  onDesignarEntregador?: (entregaId: number, entregadorId: number) => void;
  onMarcarComoEntregue?: (entregaId: number) => void;
  onStatusChange: (entregaId: number, newStatus: string) => void;
}

export const EntregaColumn: React.FC<EntregaColumnProps> = ({
  columnId,
  title,
  entregas,
  onDesignarEntregador,
  onMarcarComoEntregue,
  onStatusChange,
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
                ? (selectedEntregador: number) => onDesignarEntregador(entrega.id, selectedEntregador)
                : undefined
              }
              onMarcarComoEntregue={
              columnId === 'SaiuParaEntrega' && onMarcarComoEntregue
                ? () => onMarcarComoEntregue(entrega.id)
                : undefined
              }
              onStatusChange={onStatusChange}
            />
            </li>
        ))}
      </ul>
    </div>
  );
};