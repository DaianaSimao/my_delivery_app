import React from 'react';

interface NeighborhoodModalProps {
  onNeighborhoodChange: (neighborhood: string) => void;
  onClose: () => void;
}

const NeighborhoodModal: React.FC<NeighborhoodModalProps> = ({
  onNeighborhoodChange,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Escolha o Bairro</h3>
        <div className="space-y-2 mb-6">
          {['Centro', 'Jardins', 'Pinheiros', 'Vila Madalena'].map((bairro) => (
            <button
              key={bairro}
              onClick={() => {
                onNeighborhoodChange(bairro);
                onClose();
              }}
              className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                        text-gray-900 dark:text-white"
            >
              {bairro}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodModal;