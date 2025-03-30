import React from 'react';
import { Pedido } from '../../types/Pedido';

interface PedidoModalProps {
  pedido: Pedido;
  onClose: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, onClose }) => {
    console.log("Cliente", pedido.cliente);
    console.log("endereco do cliente", pedido.cliente.endereco);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Detalhes do Pedido #{pedido.id}
        </h2>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cliente</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nome: {pedido.cliente?.nome || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Telefone: {pedido.cliente?.telefone || 'N/A'}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Endereço de Entrega</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pedido.cliente.endereco.rua}, {pedido.cliente.endereco.numero}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pedido.cliente?.endereco.bairro}, {pedido.cliente.endereco.cidade} - {pedido.cliente.endereco.estado}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">CEP: {pedido.cliente.endereco.cep}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Itens do Pedido</h3>
          <ul className="list-disc list-inside">
            {pedido.itens_pedidos.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {item.quantidade}x {item.produto.nome} - R$: {item.quantidade * item.produto.preco}

                {item.acompanhamentos_pedidos && item.acompanhamentos_pedidos.length > 0 && (
                  <ul className="ml-4 list-disc list-inside">
                    {Object.entries(
                      item.acompanhamentos_pedidos.reduce((acc, acompanhamento) => {
                        const nomeAcompanhamento = acompanhamento.item_acompanhamento.acompanhamento.nome;
                        if (!acc[nomeAcompanhamento]) {
                          acc[nomeAcompanhamento] = {
                            quantidadeTotal: 0,
                            itens: [],
                          };
                        }
                        acc[nomeAcompanhamento].quantidadeTotal += acompanhamento.quantidade;
                        acc[nomeAcompanhamento].itens.push(acompanhamento);
                        return acc;
                      }, {} as Record<string, { quantidadeTotal: number; itens: typeof item.acompanhamentos_pedidos }>)
                    ).map(([nomeAcompanhamento, { quantidadeTotal, itens }], aIndex) => (
                      <li key={aIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        {nomeAcompanhamento} (Quantidade: {Number(quantidadeTotal).toFixed(2)}) - R$ {Number(itens[0].preco_unitario * quantidadeTotal).toFixed(2)}

                        <ul className="ml-4 list-disc list-inside">
                          {itens.map((itemAcompanhamento, iaIndex) => (
                            <li key={iaIndex} className="text-sm text-gray-600 dark:text-gray-400">
                              {itemAcompanhamento.item_acompanhamento.nome} - {itemAcompanhamento.quantidade}x - R$ {itemAcompanhamento.preco_unitario}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

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