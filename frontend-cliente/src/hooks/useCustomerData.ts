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
      const numbersOnly = whatsapp.replace(/\D/g, '');
      
      const cliente = await CustomerService.findCustomerByWhatsApp(numbersOnly);
      if (cliente) {
        setClienteEncontrado(cliente);
        setShowClienteModal(true);
        
        setFormData({
          whatsapp: formatPhoneNumber(cliente.telefone),
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

  // Função para formatar o número de telefone no padrão brasileiro (XX) XXXXX-XXXX
  const formatPhoneNumber = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a formatação conforme o usuário digita
    if (numbers.length <= 2) {
      return numbers.length ? `(${numbers}` : '';
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Limita o input a 15 caracteres (tamanho máximo da formatação (XX) XXXXX-XXXX)
    if (inputValue.length > 15) return;
    
    const formattedValue = formatPhoneNumber(inputValue);
    
    // Atualiza o estado com o valor formatado para exibição
    setFormData(prev => ({ ...prev, whatsapp: formattedValue }));
    
    // Extrai apenas os números para verificar se tem a quantidade necessária para busca
    const numbersOnly = inputValue.replace(/\D/g, '');
    if (numbersOnly.length >= 11) {
      // Envia apenas os números para o backend
      buscarCliente(numbersOnly);
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