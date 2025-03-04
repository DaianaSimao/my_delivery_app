import React from 'react';

interface ConfirmationModalProps {
  clienteEncontrado: {
    nome: string;
    telefone: string;
  };
  onEdit: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  clienteEncontrado,
  onEdit,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Encontrados</h3>
        <div className="space-y-2 mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Nome: {clienteEncontrado.nome}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            WhatsApp: {clienteEncontrado.telefone}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                      text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Editar Informações
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;