import React, { useState } from 'react';
import ModalDesignarEntregador from './ModalDesignarEntregador';
import ModalInformacoesEntrega from './ModalInformacoesEntrega';

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
  onCancelarEntrega?: () => void;
  onMudarStatus?: (novoStatus: string) => void;
}

const EntregaCard: React.FC<EntregaCardProps> = ({
  entrega,
  onDesignarEntregador,
  onMarcarComoEntregue,
  onCancelarEntrega,
  onMudarStatus,
}) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isModalDesignarOpen, setIsModalDesignarOpen] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const handleImprimirComanda = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique abra o modal
    const comanda = `
      Comanda do Pedido #${entrega.pedido_id}
      Cliente: ${entrega.pedido.cliente.nome} (${entrega.pedido.cliente.telefone})
      Endereço: ${entrega.pedido.endereco.rua}, ${entrega.pedido.endereco.numero} - ${entrega.pedido.endereco.bairro}, ${entrega.pedido.endereco.cidade}/${entrega.pedido.endereco.estado} - ${entrega.pedido.endereco.cep}
      Forma de Pagamento: ${entrega.pedido.forma_pagamento}
      Observações: ${entrega.pedido.observacoes || 'Nenhuma'}
    `;
    console.log(comanda);
    alert('Comanda impressa no console!');
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4 cursor-pointer relative"
        onClick={abrirModal} // Agora o card todo abre o modal
      >
        {/* Ícone de três pontinhos no canto superior direito */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Impede que o clique abra o modal de informações
              setIsActionsOpen(!isActionsOpen);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
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

          {/* Menu de Ações */}
          {isActionsOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
              onClick={(e) => e.stopPropagation()} // Impede que o clique no dropdown abra o modal
            >
              <div className="py-1">
                {/* Select de Mudança de Status */}
                <select
                  onChange={(e) => {
                    e.stopPropagation();
                    if (onMudarStatus) onMudarStatus(e.target.value);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <option value="">Mudar Status</option>
                  <option value="Aguardando">Aguardando</option>
                  <option value="SaiuParaEntrega">Saiu para Entrega</option>
                  <option value="Entregue">Entregue</option>
                </select>

                {/* Botão de Cancelar Entrega */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCancelarEntrega) onCancelarEntrega();
                    setIsActionsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancelar Entrega
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo do Card */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pedido #{entrega.pedido_id}
        </p>

        {entrega.entregador && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Entregador: {entrega.entregador.nome} ({entrega.entregador.veiculo})
          </p>
        )}

        {/* Botões de Ação */}
        <div className="mt-4">
          {onDesignarEntregador && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalDesignarOpen(true);
              }}
              className="w-full bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Designar Entregador
            </button>
          )}

          {onMarcarComoEntregue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarcarComoEntregue();
              }}
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
      </div>

      {/* Modal para Designar Entregador */}
      {onDesignarEntregador && (
        <ModalDesignarEntregador
          isOpen={isModalDesignarOpen}
          onClose={() => setIsModalDesignarOpen(false)}
          onDesignar={onDesignarEntregador}
        />
      )}

      {/* Modal de Informações da Entrega */}
      {modalAberto && (
        <ModalInformacoesEntrega
          isOpen={modalAberto}
          onClose={fecharModal}
          entrega={entrega}
        />
      )}
    </>
  );
};

export default EntregaCard;
