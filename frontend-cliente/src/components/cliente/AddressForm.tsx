import React, { useState } from 'react';
import { Home, Briefcase, Users } from 'lucide-react';
import NeighborhoodModal from './modals/NeighborhoodModal';

interface AddressFormProps {
  formData: {
    street: string;
    number: string;
    complement: string;
    reference: string;
    neighborhood: string;
    city: string;
    addressType: string;
    regioes_entrega_id: number;
  };
  onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onComplementChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReferenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNeighborhoodChange: (neighborhood: string, regionId: number, city: string) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressTypeChange: (addressType: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  onStreetChange,
  onNumberChange,
  onComplementChange,
  onReferenceChange,
  onNeighborhoodChange,
  onAddressTypeChange,
  onSubmit,
}) => {
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const addressTypes = [
    { id: 'Casa', title: 'Casa', icon: <Home className="w-6 h-6" /> },
    { id: 'Trabalho', title: 'Trabalho', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'Amigos', title: 'Amigos', icon: <Users className="w-6 h-6" /> },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
      <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Região de Entrega</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formData.neighborhood}</p>
        </div>
        <button
          onClick={() => setShowNeighborhoodModal(true)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          Ver Opções
        </button>
      </div>

      {showNeighborhoodModal && (
        <NeighborhoodModal
          onNeighborhoodChange={(neighborhood, regionId, city) => {
            onNeighborhoodChange(neighborhood, regionId, city);
            setShowNeighborhoodModal(false);
          }}
          onClose={() => setShowNeighborhoodModal(false)}
        />
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rua
          </label>
          <input
            type="text"
            id="street"
            value={formData.street}
            onChange={onStreetChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                      px-4 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={onNumberChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                        px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Complemento
            </label>
            <input
              type="text"
              id="complement"
              value={formData.complement}
              onChange={onComplementChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                        px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ponto de Referência
          </label>
          <input
            type="text"
            id="reference"
            value={formData.reference}
            onChange={onReferenceChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                      px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome do Endereço
          </label>
          <div className="grid grid-cols-3 gap-4">
            {addressTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onAddressTypeChange(type.id)}
                className={`p-4 rounded-lg border ${
                  formData.addressType === type.id
                    ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                } flex flex-col items-center justify-center space-y-2`}
              >
                <div className={`${
                  formData.addressType === type.id
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {type.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{type.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Salvar Endereço
        </button>
      </form>
    </div>
  );
};

export default AddressForm;