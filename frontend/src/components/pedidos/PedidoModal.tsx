// components/PedidoModal.tsx
import React from 'react';

interface PedidoModalProps {
  pedido: {
    id: number;
    status: string;
    cliente: {
      nome: string;
    };
    valor_total: number;
    itens_pedidos: Array<{
      produto: {
        nome: string;
      };
      quantidade: number;
      preco_unitario: number;
    }>;
    // Outros campos necessários
  };
  onClose: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Detalhes do Pedido #{pedido.id}</h2>
        <p>Cliente: {pedido.cliente.nome}</p>
        <p>Status: {pedido.status}</p>
        <p>Total: R$ {pedido.valor_total}</p>
        <h3 className="text-lg font-semibold mt-4">Itens do Pedido</h3>
        <ul>
          {pedido.itens_pedidos.map(item => (
            <li key={item.produto.nome}>
              {item.produto.nome} - {item.quantidade} x R$ {item.preco_unitario}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PedidoModal;