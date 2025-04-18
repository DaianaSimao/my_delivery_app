import React, { useEffect, useState } from 'react';
import { fetchRegioesEntrega } from '../../../services/api';
import { useRestauranteId } from '../../../hooks/useRestauranteId';

interface NeighborhoodModalProps {
  onNeighborhoodChange: (neighborhood: string, regionId: number, cidade: string) => void; 
  onClose: () => void;
}

const NeighborhoodModal: React.FC<NeighborhoodModalProps> = ({
  onNeighborhoodChange,
  onClose,
}) => {
  const [regioes, setRegioes] = useState<any[]>([]);
  const restauranteId = useRestauranteId();

  useEffect(() => {
    if (restauranteId) {
      fetchRegioesEntrega(restauranteId).then((data) => {
        setRegioes(data);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Escolha o Bairro</h3>
        <div className="space-y-2 mb-6">
          {regioes.map((regiao) => (
            <button
              key={regiao.id}
              onClick={() => {
                onNeighborhoodChange(regiao.bairro, regiao.id, regiao.cidade);
                onClose();
              }}
              className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                        text-gray-900 dark:text-white"
            >
              {regiao.bairro} (Taxa: R$ {regiao.taxa_entrega})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodModal;