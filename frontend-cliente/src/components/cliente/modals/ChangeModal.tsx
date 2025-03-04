import React from 'react';

interface ChangeModalProps {
  trocoValue: string;
  onTrocoChange: (troco: string) => void;
  onClose: () => void;
}

const ChangeModal: React.FC<ChangeModalProps> = ({
  trocoValue,
  onTrocoChange,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Precisa de Troco?</h3>
        <input
          type="number"
          value={trocoValue}
          onChange={(e) => onTrocoChange(e.target.value)}
          placeholder="Valor para troco"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                    mb-4"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                      text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Não Preciso
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeModal;