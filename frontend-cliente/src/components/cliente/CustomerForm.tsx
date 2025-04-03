import React from 'react';
import { ICustomerFormData, ICustomerValidation } from '../../types/CustomerTypes';

interface CustomerFormProps {
  formData: ICustomerFormData;
  validation?: ICustomerValidation;
  onWhatsappChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  validation,
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
          placeholder='(XX) 9XXXX-XXXX'
          pattern="^\(\d{2}\) \d{1}\d{4}-\d{4}$"
          maxLength={15}
          minLength={15}
          value={formData.whatsapp}
          onChange={onWhatsappChange}
          className={`mt-1 block w-full rounded-lg border 
            ${validation?.errors.whatsapp ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
            px-4 py-2`}
          required
        />
        {validation?.errors.whatsapp && (
          <p className="mt-1 text-sm text-red-500">{validation.errors.whatsapp}</p>
        )}
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
            className={`mt-1 block w-full rounded-lg border 
              ${validation?.errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
              px-4 py-2`}
            required
          />
          {validation?.errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{validation.errors.firstName}</p>
          )}
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
            className={`mt-1 block w-full rounded-lg border 
              ${validation?.errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
              px-4 py-2`}
            required
          />
          {validation?.errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{validation.errors.lastName}</p>
          )}
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