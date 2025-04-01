import { useState, useCallback } from 'react';
import { CustomerService } from '../services/customerService';
import { 
  ICustomer, 
  ICustomerFormData, 
  ICustomerValidation 
} from '../types/CustomerTypes';
import { toast } from 'react-hot-toast';

const useCustomerData = () => {
  const [clienteEncontrado, setClienteEncontrado] = useState<ICustomer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [formData, setFormData] = useState<ICustomerFormData>({
    whatsapp: '',
    firstName: '',
    lastName: '',
  });

  const validateForm = (data: ICustomerFormData): ICustomerValidation => {
    const errors: ICustomerValidation['errors'] = {};
    let isValid = true;

    if (!data.whatsapp.trim()) {
      errors.whatsapp = 'WhatsApp é obrigatório';
      isValid = false;
    }

    if (!data.firstName.trim()) {
      errors.firstName = 'Nome é obrigatório';
      isValid = false;
    }

    if (!data.lastName.trim()) {
      errors.lastName = 'Sobrenome é obrigatório';
      isValid = false;
    }

    return { isValid, errors };
  };

  const buscarCliente = useCallback(async (whatsapp: string) => {
    try {
      const cliente = await CustomerService.findCustomerByWhatsApp(whatsapp);
      if (cliente) {
        setClienteEncontrado(cliente);
        setShowClienteModal(true);
        setFormData({
          whatsapp: cliente.telefone,
          firstName: cliente.nome,
          lastName: cliente.sobrenome,
        });
      } else {
        setClienteEncontrado(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setClienteEncontrado(null);
    }
  }, []);

  const handleWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, whatsapp: value }));
    
    if (value.replace(/\D/g, '').length >= 9) {
      buscarCliente(value);
    }
  }, [buscarCliente]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, firstName: e.target.value }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, lastName: e.target.value }));
  };

  return {
    formData,
    clienteEncontrado,
    isEditing,
    setIsEditing,
    handleWhatsappChange,
    handleFirstNameChange,
    handleLastNameChange,
    showClienteModal,
    setShowClienteModal,
    setClienteEncontrado,
    validateForm
  };
};

export default useCustomerData;