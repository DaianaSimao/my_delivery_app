import React, { useState } from 'react';
import ModalDesignarEntregador from './ModalDesignarEntregador';
import ModalInformacoesEntrega from './ModalInformacoesEntrega';
import { gerarComandaPDF } from '../../utils/comandaEntregaGenerator';
import { Entrega } from '../../types/Entrega';

interface EntregaCardProps {
  entrega: Entrega;
  onDesignarEntregador?: (entregadorId: number) => void;
  onMarcarComoEntregue?: () => void;
  onStatusChange: (entregaId: number, newStatus: string) => void;
}

const EntregaCard: React.FC<EntregaCardProps> = ({
  entrega,
  onDesignarEntregador,
  onMarcarComoEntregue,
  onStatusChange,
}) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalDesignarOpen, setIsModalDesignarOpen] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const statusOrder = ['Aguardando', 'Em entrega', 'Entregue'];

  const handleImprimirComanda = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique abra o modal
    gerarComandaPDF(entrega); // Usa a função utilitária para gerar o PDF
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4 cursor-pointer relative"
        onClick={abrirModal}
      >
        {/* Ícone de três pontinhos no canto superior direito */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="py-1">
                {/* Mudar Status */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    }}
                    className="flex justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Mudar Status
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                      {statusOrder.map((status) => (
                        <button
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(entrega.id, status);
                          }}
                          className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo do Card */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pedido #{entrega.pedido_id}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Entregador: {entrega.entregador ? `${entrega.entregador.nome} (${entrega.entregador.veiculo})` : 'Sem entregador'}
        </p>

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
              🏍️ Designar Entregador
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
              📥 Marcar como Entregue
            </button>
          )}

          {/* Botão para Imprimir Comanda */}
          <button
            onClick={handleImprimirComanda}
            className="w-full bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition-colors mt-2"
          >
            🧾 Imprimir Comanda
          </button>
        </div>
      </div>

      {/* Modal para Designar Entregador */}
      {onDesignarEntregador && (
        <ModalDesignarEntregador
          isOpen={isModalDesignarOpen}
          onClose={() => setIsModalDesignarOpen(false)}
          onDesignar={onDesignarEntregador} />
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