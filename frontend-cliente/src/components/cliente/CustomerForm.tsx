import React from 'react';

interface CustomerFormProps {
  formData: {
    whatsapp: string;
    firstName: string;
    lastName: string;
  };
  onWhatsappChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  onWhatsappChange,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número de WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          value={formData.whatsapp}
          onChange={onWhatsappChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                    px-4 py-2"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={onFirstNameChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                      px-4 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sobrenome
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={onLastNameChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                      px-4 py-2"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
      >
        Avançar
      </button>
    </form>
  );
};

export default CustomerForm;