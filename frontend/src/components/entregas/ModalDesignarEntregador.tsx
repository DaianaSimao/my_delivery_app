import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Entregador {
  id: number;
  nome: string;
  telefone: string;
  veiculo: string;
}

interface ModalDesignarEntregadorProps {
  isOpen: boolean;
  onClose: () => void;
  onDesignar: (entregadorId: number) => void;
}

const ModalDesignarEntregador: React.FC<ModalDesignarEntregadorProps> = ({
  isOpen,
  onClose,
  onDesignar,
}) => {
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [selectedEntregador, setSelectedEntregador] = useState<number | null>(null);

  // Busca a lista de entregadores
  useEffect(() => {
    const fetchEntregadores = async () => {
      try {
        const response = await api.get('/api/v1/entregadores');
        if (response.status === 200) {
          setEntregadores(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar entregadores:', error);
      }
    };

    if (isOpen) {
      fetchEntregadores();
    }
  }, [isOpen]);

  const handleDesignar = () => {
    if (selectedEntregador) {
      onDesignar(selectedEntregador);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Designar Entregador
        </h2>

        {/* Select de Entregadores */}
        <select
          value={selectedEntregador || ''}
          onChange={(e) => setSelectedEntregador(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            Selecione um entregador
          </option>
          {entregadores.map((entregador) => (
            <option key={entregador.id} value={entregador.id}>
              {entregador.nome} ({entregador.veiculo})
            </option>
          ))}
        </select>

        {/* Botões do Modal */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDesignar}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Designar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDesignarEntregador;